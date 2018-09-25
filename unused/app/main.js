let hid
const client = window.io()
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let connected
let allowPointerEvents = true
const activeKeys = []

const JAVA_KEYMAP = {
	8: 'BACK_SPACE',
	9: 'TAB',
	13: 'ENTER',
	16: 'SHIFT',
	17: 'CONTROL',
	18: 'ALT',
	27: 'ESCAPE',
	32: 'SPACE',
	37: 'LEFT',
	38: 'UP',
	39: 'RIGHT',
	40: 'DOWN',
	91: 'META',
	186: 'SEMICOLON',
	187: 'EQUALS',
	188: 'COMMA',
	190: 'PERIOD',
	189: 'MINUS',
	222: 'QUOTE',
	191: 'SLASH',
	192: 'BACK_QUOTE',
	220: 'BACK_SLASH',
	219: 'OPEN_BRACKET',
	221: 'CLOSE_BRACKET'
}

client.on('connect', initialized)
client.on('disconnect', disconnected)
client.on('resize', resizeCanvas)
client.on('frame', drawImagePNG)
client.on('page.event', handlePageEvent)
client.on('target.event', handleTargetEvent)

canvas.addEventListener('mousedown', handlePointer)
canvas.addEventListener('mousemove', _.throttle(handlePointer, 200))
canvas.addEventListener('mouseup', handlePointer)
canvas.addEventListener('wheel', handleWheel)
canvas.addEventListener('click', handleClick)
canvas.addEventListener('keydown', handleKey)
canvas.addEventListener('keyup', handleKey)

canvas.addEventListener('contextmenu', e => {
	e.preventDefault()
})
canvas.addEventListener('mouseleave', e => {
	while (activeKeys.length) {
		const key = activeKeys.pop()
		hid.send(`KU ${key}`)
	}
	hid.send('MU 1')
})

async function api(cmd, ...args) {
	return new Promise((resolve, reject) => {
		if (!connected) reject()
		else
			client.emit(cmd, ...args, res => {
				resolve(res)
			})
	})
}

function initialized() {
	connected = true
	hid = new WebSocket(`ws://${location.hostname}:47664`)
	clearCanvas()
}
function disconnected() {
	connected = false
	hid.close()
	clearCanvas()
}

async function resizeCanvas(rect) {
	canvas.width = rect.width
	canvas.height = rect.height
}
async function clearCanvas() {
	ctx.fillStyle = '#373e44'
	ctx.rect(0, 0, canvas.width, canvas.height)
	ctx.fill()
}
async function drawImagePNG(rect) {
	const { type, src, x, y, width, height, image } = rect
	switch (type) {
		case 'copy':
			// console.log('copy rect', x, y, width, height, src.x, src.y)
			const data = ctx.getImageData(src.x, src.y, width, height)
			ctx.putImageData(data, x, y)
			break
		case 'base64':
			// console.log('draw rect', x, y, width, height)
			const img = new Image()
			img.onload = e => {
				ctx.drawImage(img, x, y, width, height)
			}
			img.src = 'data:image/png;base64,' + image
			break
	}
	api('update')
}

async function handleKey(e) {
	e.preventDefault()
	if (!connected || !allowPointerEvents) return
	const key = keyFromCode(e.keyCode)
	if (key) {
		switch (e.type) {
			case 'keydown':
				activeKeys.push(key)
				hid.send(`KD ${key}`)
				break
			case 'keyup':
				activeKeys.slice(activeKeys.indexOf(key), 1)
				hid.send(`KU ${key}`)
				break
		}
	} else {
		console.log(e.keyCode)
	}
}
async function handlePointer(e) {
	e.preventDefault()
	if (!allowPointerEvents || e.shiftKey || !connected) return
	const { offsetX, offsetY, which } = e
	const scale = canvas.offsetWidth / canvas.width
	const x = offsetX / scale
	const y = offsetY / scale
	switch (e.type) {
		case 'mousemove':
			hid.send(`MV ${x},${y}`)
			break
		case 'mouseup':
			hid.send(`MV ${x},${y}`)
			hid.send(`MU ${which}`)
			break
		case 'mousedown':
			canvas.focus()
			hid.send(`MV ${x},${y}`)
			hid.send(`MD ${which}`)
			break
	}
	// api('pointer', x, y, MOUSE_BTN_MASKS[which])
}
let scroll = 0
const sendScroll = _.throttle(function sendScroll() {
	const steps = Math.round(scroll / 20)
	if (connected) hid.send(`MW ${steps}`)
	scroll = 0
}, 100)
async function handleWheel(e) {
	scroll += e.deltaY
	sendScroll()
}
async function handleClick(e) {
	if (!e.shiftKey) return
	const { offsetX, offsetY, which } = e
	const scale = canvas.offsetWidth / canvas.width
	const x = offsetX / scale
	const y = offsetY / scale
	api('page.exec', `_elementsFromPoint(${x},${y})`).then(res => {
		if (res.success) console.log(res.result)
		else console.log(res.error)
	})
}

let lastPageUnloadTime
async function handlePageEvent(event, data) {
	if (event === 'unload') handlePageUnload()
	else if (event === 'load') handlePageLoad()
	else if (event === 'ready') handlePageDomReady()
	else if (event === 'pointer') handlePagePointer(data)
	else console.log('page', event, data)
}
async function handleTargetEvent(event, data) {
	if (data.type === 'page') {
		if (event === 'change') {}
		else console.log('target', event, data.url)
	}
}

function handlePagePointer(data) {
	console.log(`page ${data.event} @${data.position.x},${data.position.y} ("${data.target.selector}")`)
}
function handlePageUnload() {
	allowPointerEvents = false
	canvas.style.opacity = '0.5'
	lastPageUnloadTime = Date.now()
}
function handlePageDomReady() {
	if (lastPageUnloadTime) {
		const waitTime = Date.now() - lastPageUnloadTime
		console.log('page wait', waitTime, 'ms')
	}
}
function handlePageLoad() {
	allowPointerEvents = true
	canvas.style.opacity = '1'
	if (lastPageUnloadTime) {
		const waitTime = Date.now() - lastPageUnloadTime
		console.log('page load', waitTime, 'ms')
	}
}

function keyFromCode(code) {
	// a-z - US Keyboard
	if ((code >= 65) & (code <= 90)) {
		return String.fromCharCode(code).toUpperCase()
	} else if ((code >= 48) & (code <= 57)) {
		return String.fromCharCode(code).toUpperCase()
	} else {
		return JAVA_KEYMAP[code]
	}
}



// document.querySelector('#command_input').addEventListener('keydown', e => e.stopPropagation())

function runCommand() {
	const input = document.querySelector('#command_input')
	const output = document.querySelector('#command_output')
	output.innerText = 'running...'
	api('exec', input.value).then(res => {
		output.innerText = input.value + '\n\n' + (res.success ? JSON.stringify(res.result) : res.error)
		input.value = ''
	})
	return false
}
function inspect(...args) {
	api('exec', ...args).then(console.log)
}
function exec(...args) {
	api('exec', ...args)
}