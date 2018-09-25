const { fork } = require('child_process')
const { watch } = require('fs')
const debounce = require('lodash/debounce')

let server

watch('./api/server.js', debounce(() => server.kill(9), 1000))

process.on('uncaughtException', e => {
	console.log(e)
})
process.on('unhandledRejection', e => {
	console.log(e)
})

start()

function start() {
	server = fork(__dirname + '/api/server.js', { env: process.env })
	server.on('exit', start)
}
