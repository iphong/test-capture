;(async function main() {
	const _ = require('underscore')
	const chrome = require('selenium-webdriver/chrome')
	const { Builder, By, Key, until } = require('selenium-webdriver')
	const builder = new Builder()
	const driver = builder.forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build()
	const express = require('express')
	const app = express()
	const http = require('http').Server(app)
	const io = require('socket.io')(http)
	const rfb = require('rfb2')
	const fs = require('fs')
	const child = require('child_process')
	let screenWidth = 1024
	let screenHeight = 768

	const uniqueSelectorScript = fs.readFileSync('lib/unique-selector.js').toString('utf8')
	// const client = rfb.createConnection({
	// 	host: 'localhost',
	// 	port: 5900,
	// 	password: '123456'
	// })

	async function getSelector(x, y) {
		const checkLib = await driver.executeScript(function() {
			return window.__unique_selector
		})
		if (!checkLib) {
			await driver.executeScript(uniqueSelectorScript)
		}
		const selector = await driver.executeScript(
			function(x, y) {
				const unique = window.__unique_selector.default
				const path = document.elementsFromPoint(x, y)
				let selector = {
					query: ''
				}
				const node = path.find(
					el =>
						(selector.query = unique(el, {
							// selectorTypes: ['ID', 'Class', 'Tag', 'NthChild']
							// selectorTypes: ['Tag', 'Class', 'ID', 'NthChild']
							// selectorTypes: ['ID', 'Class']
						}))
				)
				if (node.nodeName === 'IFRAME' && node.name) {
					const doc = node.contentDocument
					const offsetX = x - node.offsetLeft
					const offsetY = y - node.offsetTop
					let selector2
					const path2 = doc.elementsFromPoint(offsetX, offsetY)
					path2.find(
						el =>
							(selector2 = unique(el, {
								// selectorTypes: ['ID', 'Class', 'Tag', 'NthChild']
								// selectorTypes: ['Tag', 'Class', 'ID', 'NthChild']
							}))
					)
					// selector.frame = {
					// 	query: selector.query,
					// 	name: node.name
					// }
					// selector.element = {
					// 	query: selector2
					// }
					selector.query = `${selector.query} | ${selector2}`
				}
				return selector
			},
			x,
			y
		)
		return selector
	}
	async function sendScreen() {
		io.emit('screen', screenWidth, screenHeight, await driver.takeScreenshot())
	}

	app.use(express.static('www'))

	// client.on('connect', async () => {
	// 	console.log('successfully connected and authorised')
	// 	console.log('remote screen name: ' + client.title + ' width:' + client.width + ' height: ' + client.height)
	//
	// })
	// client.on('error', e => {
	// 	console.log(new Error(e))
	// })
	// client.on('rect', rect => {
	// 	switch (rect.encoding) {
	// 		case rfb.encodings.raw:
	// 			// rect.x, rect.y, rect.width, rect.height, rect.data
	// 			// io.emit('rect', {
	// 			// 	x: rect.x,
	// 			// 	y: rect.y,
	// 			// 	width: rect.width,
	// 			// 	height: rect.height,
	// 			// 	data: new Uint8Array(rect.buffer),
	// 			// 	encoding: rect.encoding
	// 			// })
	// 			break
	// 		case rfb.encodings.copyRect:
	// 			break
	// 	}
	// })
	// client.on('resize', async rect => {
	// 	console.log('window size has been resized! Width: %s, Height: %s', rect.width, rect.height)
	// 	await driver
	// 		.manage()
	// 		.window()
	// 		.setRect({ x: 0, y: 0, width: rect.width, height: rect.height })
	// 	await sendScreen()
	// })
	// client.on('clipboard', newPasteBufData => {
	// 	console.log('remote clipboard updated!', newPasteBufData)
	// 	io.emit('clipboard', newPasteBufData)
	// })
	// client.on('bell', () => {
	// 	io.emit('bell')
	// })

	io.on('connection', socket => {
		console.log('Socket connected:', socket.id)

		socket.on('pointerEvent', async (...args) => {
			// client.pointerEvent(...args)
		})
		socket.on('keyEvent', async (...args) => {
			// client.keyEvent(...args)
		})
		socket.on('set-display-resolution', (w, h) => {
			child.exec(`xrandr -s "${w}x${h}"`, { env: { DISPLAY: ':0' } })
			// client.requestUpdate(false, 0, 0, client.width, client.height)
		})
		socket.on('get-selector-from-point', async (x, y, cb) => {
			await getSelector(x, y).then(cb)
		})
		socket.on('page.reload', async cb => {
			await driver
				.navigate()
				.refresh()
				.then(cb)
		})

		// socket.on('updateClipboard', client.updateClipboard.bind(client))
		// socket.on('requestUpdate', client.requestUpdate.bind(client))

		sendScreen()
	})
	await driver.get('http://10.211.55.2/pagefly')
	await driver
		.manage()
		.window()
		.setRect({ x: 0, y: 0, width: 1024, height: 768 })

	http.listen(3000, async function() {
		console.log('listening on *:3000')
		setTimeout(async function loop() {
			// await driver.getAllWindowHandles().then(windows => {
			// 	driver.switchTo().window(windows[windows.length - 1])
			// })
			await sendScreen()
			setTimeout(loop, 50)
		}, 0)
	})
})()
