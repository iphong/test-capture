let socket
const queue = new Set()

export function getSocket() {
	if (!socket) {
		socket = new WebSocket('ws://localhost:47664')
		socket.addEventListener('open', () => {
			console.log('connected')
			queue.forEach(value => socket.send(value))
			queue.clear()
		})
		socket.addEventListener('close', () => {
			console.log('disconnected')
			socket = null
		})
	}
	return socket
}
export function send(data) {
	const socket = getSocket()
	if (socket.readyState !== socket.OPEN) queue.add(data)
	else socket.send(data)
}

export function scroll(delta) {
	send(`MW ${delta}`)
}
export function click(x, y, btn = 1) {
	send(`MV ${x},${y}; MC ${btn}`)
}
export function press(key) {
	send(`KP ${key}`)
}

export function pointerDown(x, y, btn = 1) {
	send(`MV ${x},${y}; MD ${btn}`)
}
export function pointerMove(x, y) {
	send(`MV ${x},${y}`)
}
export function pointerUp(x, y, btn = 1) {
	send(`MV ${x},${y}; MU ${btn}`)
}
export function keyDown(key) {
	send(`KD ${key}`)
}
export function keyUp(key) {
	send(`KU ${key}`)
}

