const util = require('util')
const puppeteer = require('puppeteer')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const { join } = require('path')
const fs = require('fs')
// const { spawn } = require('child_process')

let browser = null
let pages = null
let page = null
let dialog = null
let block_action

const display = 0
// const vnc_port = display + 5900
// const proxy_port = display + 6900

const chromeArgs = [
	'--display=:' + display,
	// '--no-sandbox',
	`--window-size=1366,768`,
	'--window-position=0,0',
	'--stable-release-mode',
	'--start-fullscreen',
	'--start-maximized',
	'--disable-sync',
	// '--disable-gpu',
	// '--incognito',
	// '--silent-launch',
	// '--browser-test',
	'--disable-infobars',
	'--disable-extensions',
	'--disable-default-apps',
	'--disable-web-security',
	'--disable-sync',
	'--disable-sync-app-list',
	'--disable-network-portal-notification',
	'--disable-suggestions-ui',
	'--enable-fullscreen-toolbar-reveal=false',
	'--safebrowsing-disable-auto-update',
	'--safebrowsing-disable-download-protection',
	'--safebrowsing-disable-extension-blacklist',
	// '--disable-accelerated-video-decode',
	'--reduce-security-for-testing',
	// '--disable-smooth-scrolling',
	'--disable-resize-lock',
	'--hide-scrollbars',
	'--no-managed-user-acknowledgment-check ',
	'--no-first-run',
	'--no-experiments',
	'--no-default-browser-check',
	'--new-window'
]

process.on('uncaughtException', handleError)
process.on('unhandledRejection', handleError)

// const vncArgs = [`:${display}`, '-port', `${proxy_port}`, '-SecurityTypes', 'none', '-geometry', '1366x768']
// spawn('Xvnc', vncArgs, { env: { display: `${display}` } }).stderr.pipe(process.stderr)
// setTimeout(() => {
// 	spawn('python', [join(__dirname, 'websockify.py'), `${proxy_port}`, `127.0.0.1:${vnc_port}`]).stderr.pipe(
// 		process.stderr
// 	)
// })

io.of('/helper').on('connection', handleHelper)
io.of('/builder').on('connection', handleBuilder)

app.use(express.static(join(__dirname, 'public')))

http.listen(80, () => {
	console.log('- WEB listening on port', 80)
})

async function handleHelper(socket) {
	socket.on('message', (display, ...args) => {
		console.log('received', display)
		io
			.of('/builder')
			.in(`display:${display}`)
			.emit('capture', ...args)
	})
}
async function handleBuilder(socket) {
	socket.join(`display:${display}`)
	// socket.emit('rfb_port', proxy_port)
	socket.on('launch', async (url, callback) => {
		if (block_action) callback(false)
		block_action = true
		if (browser) await browser.close()
		browser = await handleBrowser(
			await puppeteer.launch({
				headless: false,
				ignoreHTTPSErrors: true,
				// ignoreDefaultArgs: true,
				args: chromeArgs
			})
		)
		page = await handlePage((await browser.pages())[0])
		await page.goto(url)
		block_action = false
		callback(true)
	})
	socket.on('dialog', async accept => {
		if (dialog) {
			if (accept) await dialog.accept()
			else await dialog.dismiss()
			dialog = null
		}
	})
	socket.on('exec', async (cmd, data, callback) => {
		try {
			const args = { ...data, browser, pages, page }
			const func = eval(`async (${Object.keys(args).toString()}) => (await ${cmd})`)
			const value = await func(...Object.values(args))
			let result = util.inspect(value)
			callback({ success: true, result: result })
		} catch (e) {
			callback({ success: false, error: e.message })
		}
	})
	socket.on('eval', async (func, args = [], callback) => {
		try {
			const value = await page.evaluate(eval(`(${func})`), ...args)
			callback({ success: true, value })
		} catch (e) {
			callback({ success: false, error: e.message })
		}
	})
	socket.on('_eval', async (func, args = [], callback) => {
		try {
			const value = await eval(`(${func})`)(...args)
			callback({ success: true, value })
		} catch (e) {
			callback({ success: false, error: e.message })
		}
	})
}
async function handleBrowser(browser) {
	browser.on('disconnected', async () => {
		await browser.close()
		page = null
		pages = null
		browser = null
	})
	browser.on('targetcreated', async target => {
		const url = await target.url()
		const type = await target.type()
		if (type === 'page') {
			page = await target.page()
			await handlePage(page)
			await page.bringToFront()
			handleEvent('new tab', url)
		}
	})
	browser.on('targetchanged', async target => {
		const url = await target.url()
		const type = await target.type()
		// handleEvent(type + ' changed', url)
		handleDebug('context changed', type, url)
	})
	browser.on('targetdestroyed', async target => {
		const url = await target.url()
		const type = await target.type()
		// handleEvent(type + ' destroyed', url)
		handleDebug('context destroyed', type, url)
		if (type === 'page') {
			pages = await browser.pages()
			if (!pages.length) {
				await browser.close()
			} else {
				page = pages[pages.length - 1]
			}
		}
	})
	return browser
}
async function handlePage(page) {
	if (!page) return
	await page.bringToFront()
	await page.setViewport({ width: 1366, height: 694, isMobile: false })
	const script = fs.readFileSync(join(__dirname, 'helper.js'), 'utf8')
	await page.evaluateOnNewDocument(`window.__BUILDER_DISPLAY = '${display}'`)
	await page.evaluateOnNewDocument(script)
	await page.setRequestInterception(false)

	page.on('load', async dialog => {
		handleEvent('load', await page.url())
	})
	page.on('dialog', async d => {
		dialog = d
		io
			.of('/builder')
			.in(`display:${display}`)
			.emit('dialog', await d.type(), await d.message())
	})
	// page.on('frameattached', async frame => {
	// 	handleEvent('frameattached', await page.frames().length)
	// })
	// page.on('framenavigated', async frame => {
	// 	handleEvent('framenavigated', await frame.url())
	// })
	// page.on('framedetached', async frame => {
	// 	handleEvent('framedetached', await page.frames().length)
	// })
	page.on('close', async dialog => {
		handleEvent('close tab', await page.url())
	})
	page.on('request', async req => {
		// const method = await req.method()
		// const url = await req.url()
		// const cachePath = join(__dirname, '_cache/network', MD5.hash(`${method} ${url}`))
		// if (fs.existsSync(cachePath)) {browser.newPage()
		// 	req.response(JSON.parse(fs.readFileSync(cachePath).toString('utf8')))
		// } else
		// req.continue()
	})
	page.on('response', async res => {
		// const req = await res.request()
		// const method = await req.method()
		// const url = await req.url()
		// const ok = await res.ok()
		// if (!ok) return
		// const cachePath = join(__dirname, '_cache/network', MD5.hash(`${method} ${url}`))
		// fs.writeFileSync(
		// 	cachePath,
		// 	JSON.stringify({
		// 		status: await res.status(),
		// 		headers: await res.headers(),
		// 		body: await res.text()
		// 	})
		// )
		// handleEvent('store cache', url)
	})
	return page
}
async function handleEvent(type, ...args) {
	io
		.of('/builder')
		.in(`display:${display}`)
		.emit('event', type, ...args)
		.emit('event.' + type, ...args)
}
async function handleDebug(type, ...args) {
	io
		.of('/builder')
		.in(`display:${display}`)
		.emit('debug', type, ...args)
		.emit('debug.' + type, ...args)
}
async function handleError(error) {
	console.log(error)
}
