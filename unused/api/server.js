async function main() {
	const rfb = require('rfb2')
	const puppeteer = require('puppeteer')
	const express = require('express')
	const app = express()
	const http = require('http').Server(app)
	const io = require('socket.io')(http)
	const fs = require('fs')
	const PNG = require('pngjs').PNG
	const util = require('util')
	const exec = require('child_process').exec
	const devices = require('puppeteer/DeviceDescriptors')

	const DISPLAY = ':0'
	const VNC_PORT = process.env.VNC || 5900
	const WEB_PORT = process.env.WEB || 80
	const CHROME_ARGS = [
		'--display=' + DISPLAY,
		'--no-sandbox',
		'--stable-release-mode',
		'--disable-suggestions-ui',
		'--start-fullscreen',
		'--start-maximized',
		'--disable-sync',
		'--homepage=about:blank',
		// '--silent-launch',
		'--browser-test',
		'--disable-infobars',
		'--disable-extensions',
		'--disable-default-apps',
		'--disable-web-security',
		'--disable-sync',
		'--disable-sync-app-list',
		'--disable-network-portal-notification',
		'--disable-suggestions-ui',
		'--safebrowsing-disable-auto-update',
		'--safebrowsing-disable-download-protection',
		'--safebrowsing-disable-extension-blacklist',
		// '--remote-debugging-port=9222',
		'--window-position=0,0',
		'--disable-accelerated-video-decode',
		'--reduce-security-for-testing',
		'--disable-smooth-scrolling',
		'--disable-resize-lock',
		'--hide-scrollbars',
		'--no-managed-user-acknowledgment-check ',
		'--no-first-run',
		'--no-experiments',
		'--no-default-browser-check',
		'--new-window'
	]
	const INSPECT_OPTIONS = { showHidden: false, depth: null }

	const shopifyData = require('./data/shopify')

	// spawn('./hid', { env: { DISPLAY } })

	app.use(express.static('../www'))
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*')
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
		next()
	})
	app.post('/event/:name', (req, res) => {
		let body = ''
		req.on('data', buf => {
			body += buf.toString('utf8')
		})
		req.on('end', () => {
			try {
				body = JSON.parse(body)
				io.emit('page.event', req.params.name, body)
				res.end()
			} catch (e) {
				res.error(e)
			}
		})
	})

	io.on('connection', socket => {
		console.log('- socket connected', socket.id)

		socket.on('disconnect', async () => {
			console.log('socket disconnect')
			if (socket.browser) await socket.browser.close()
			if (socket.vnc) await socket.vnc.end()
		})
		const vnc = (socket.vnc = rfb.createConnection({
			port: VNC_PORT,
			host: 'localhost',
			password: '123456'
		}))
		socket.on('key', (key, isDown) => socket.page.keyboard[isDown ? 'down' : 'up'](key))
		socket.on('pointer', (x, y, buttons) => vnc.pointerEvent(x, y, buttons))
		socket.on('update', (x = 0, y = 0, width = vnc.width, height = vnc.height) => {
			vnc.requestUpdate(true, x, y, width, height)
		})
		socket.on('inspect', async (cmd, callback) => {
			try {
				const func = eval(`async (page, browser) => (${cmd})`)
				callback(util.inspect(await func(socket.page, socket.browser), INSPECT_OPTIONS))
			} catch (e) {
				callback(e.message)
			}
		})
		socket.on('page.inspect', async (cmd, callback) => {
			try {
				callback(util.inspect(await socket.page.evaluate(cmd), INSPECT_OPTIONS))
			} catch (e) {
				callback(e.message)
			}
		})
		socket.on('eval', async (cmd, callback) => {
			try {
				const func = eval(`async (page, browser) => (${cmd})`)
				const result = await func(socket.page, socket.browser)
				callback({ success: true, result })
			} catch (e) {
				callback({ success: false, error: e.message })
			}
		})
		socket.on('page.eval', async (cmd, data = {}, callback) => {
			try {
				const args = { ...data }
				const func = await createContext(cmd, args)
				const value = await socket.page.evaluate(func, args)
				const result = JSON.stringify(value)
				callback({ success: true, result })
			} catch (e) {
				callback({ success: false, error: e.message })
			}
		})
		socket.on('device', device => changeDevice(device, socket, vnc))
		vnc.on('resize', async rect => {
			vnc.width = rect.width
			vnc.height = rect.height
			await socket.page.setViewport({ width: vnc.width, height: vnc.height })
			vnc.requestUpdate(false, 0, 0, vnc.width, vnc.height)
		})
		vnc.on('rect', async rect => {
			const { x, y, width, height, src, buffer } = rect
			const payload = { x, y, width, height }
			switch (rect.encoding) {
				case rfb.encodings.raw:
					payload.type = 'raw'
					socket.emit('frame', payload, await createPNG(buffer, width, height))
					break
				case rfb.encodings.copyRect:
					payload.src = src
					payload.type = 'copy'
					socket.emit('frame', payload)
					break
			}
		})
		vnc.on('connect', async () => {
			console.log('-- display connected')

			await createBrowser(socket, vnc).then(async browser => {
				if (socket.connected) {
					// await changeDevice('iPhone X landscape')
					await socket.emit('resize', { width: vnc.width, height: vnc.height })
					await vnc.requestUpdate(false, 0, 0, vnc.width, vnc.height)
				} else {
					await browser.close()
					await vnc.end()
				}
			})
		})
	})

	http.listen(WEB_PORT, () => {
		console.log('- WEB listening on port', WEB_PORT)
	})

	const helper1 = fs.readFileSync('./helpers/unique-selector.js', 'utf8')
	const helper2 = fs.readFileSync('./helpers/events-sniffer.js', 'utf8')
	const vars = {}

	async function changeDevice(device, socket, vnc) {
		const metric = devices[device] || devices['iPad landscape']
		const { width, height } = metric.viewport
		await socket.page.emulate(metric)
		await socket.emit('resize', { width, height })
		await vnc.requestUpdate(false, 0, 0, vnc.width, vnc.height)
		// exec(`xrandr --fb "${width}x${height}"`, { env: { DISPLAY } }, async () => {
		//
		// })
	}
	async function createContext(cmd, args = {}) {
		args.vars = vars
		function parseArgs(input) {
			return input.replace(/\$([a-z0-9_]+)/gi, 'args["$1"]')
		}
		function parseFiles(input) {
			return input.replace(/<([^)]+)>/gi, (input, filename) => {
				if (!vars[filename]) vars[filename] = require('./share/variables/' + filename)
				return `args.vars["${filename}"]`
			})
		}
		return eval(`async (args) => (${parseFiles(parseArgs(cmd))})`)
	}
	async function createBrowser(socket) {
		const vnc = socket.vnc
		const browser = await puppeteer.launch({
			headless: false,
			userDataDir: '/root',
			// executablePath: '/usr/bin/chromium-browser',
			args: [...CHROME_ARGS, `--window-size=${vnc.width},${vnc.height}`],
			// args: CHROME_ARGS,
			ignoreHTTPSErrors: true
		})
		socket.browser = browser
		const pages = await browser.pages()
		socket.page = await initPage(pages[0], socket)

		await socket.page.evaluate(helper1)
		await socket.page.evaluate(helper2)

		browser.on('targetchanged', async target => {
			if (['page'].includes(target.type())) {
				await socket.emit('target.event', 'change', target._targetInfo)
			}
		})
		browser.on('targetcreated', async target => {
			const type = target.type()
			if (type === 'page') {
				socket.page = await target.page()
				await initPage(socket.page, socket)
				await socket.emit('target.event', 'create', target._targetInfo)
			}
		})
		browser.on('targetdestroyed', async target => {
			if (['page'].includes(target.type())) {
				const pages = await browser.pages()
				socket.page = pages[pages.length - 1]
				await socket.emit('target.event', 'destroy', target._targetInfo)
			}
		})

		return browser
	}

	async function initPage(page, socket) {
		const vnc = socket.vnc
		await page.setViewport({ width: vnc.width, height: vnc.height })
		await page.setCookie(...shopifyData.cookies)
		await page.setBypassCSP(true)
		await page.setCacheEnabled(true)
		await page.evaluateOnNewDocument(helper1)
		await page.evaluateOnNewDocument(helper2)
		await page.setDefaultNavigationTimeout(60000)
		await page.bringToFront()
		page.on('load', async () => {
			const target = await page.target()
			await socket.emit('page.event', 'load', target._targetInfo)
			// await page.evaluate(helper1)
			// await page.evaluate(helper2)
			// await vnc.requestUpdate(true, 0, 0, vnc.width, vnc.height)
		})
		page.on('error', async err => {
			await socket.emit('page.event', 'error', { message: err.message })
		})
		return page
	}
	const pngOptions = { colorType: 2, deflateLevel: 1, deflateStrategy: 3 }
	function createPNG(data, width, height) {
		return new Promise(resolve => {
			const png = new PNG()
			png.width = width
			png.height = height
			png.data = data
			resolve(PNG.sync.write(png, pngOptions).toString('binary'))
		})
	}
}

main().catch(error => {})
process.on('uncaughtException', error => {})
process.on('unhandledRejection', error => {})
