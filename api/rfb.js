const rfb = require('rfb2')

const client = rfb.createConnection({
	host: 'localhost',
	port: 5900,
	securityType: 'none'
})
client.on('connect', () => {
	setTimeout(() => {
		client.pointerEvent(50, 50, 0b000)
	}, 2000)
})
