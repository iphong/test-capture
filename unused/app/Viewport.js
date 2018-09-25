import _ from 'underscore'
import React from 'react'
import Types from 'prop-types'
import io from 'socket.io-client'
import styled from 'styled-components'
import model from 'Model'

const StyledViewport = styled.section`
	& {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		//right: 350px;
		right: 0;
		background: #373e44;
		z-index: 10;
	}
	& canvas {
		will-change: contents;
		position: absolute;
		top: 50%;
		left: 50%;
		cursor: crosshair !important;
		outline: none;
		box-shadow: 0 10px 50px rgba(0, 0, 0, 0.45);
	}
`

export default class Viewport extends React.Component {
	static propTypes = {
		url: Types.string
	}
	static defaultProps = {}
	static MOUSE_MASK = { 0: 0b00000000, 1: 0b00000001, 2: 0b00000010, 3: 0b00000100 }
	state = {
		connected: false,
		mousePressed: false,
		width: model.get('viewport.width'),
		height: model.get('viewport.height')
	}
	wrapper = React.createRef()
	canvas = React.createRef()
	mouseMask = 0b00000000
	mouseServer = 'rfb' // java,rfb
	activeKeys = []
	scale = 1
	queue = []

	active = false
	busy = false

	componentDidMount() {
		global.vp = this
		this.active = true
		this.ctx = this.canvas.current.getContext('2d')
		addEventListener('resize', this.handleResize)
		this.handleResize()
		this.connect()
	}
	componentDidUpdate() {
		this.handleResize()
	}
	componentWillUnmount() {
		this.active = false
		this.closeAllSockets()
		removeEventListener('resize', this.handleResize)
	}

	// Sockets
	onPageEvent = (event, data) => {
		return
		const lastScenario = model.get('scenarios').last()
		switch (event) {
			case 'pointer':
				if (lastScenario)
					model
						.get('scenarios')
						.last()
						.get('sequence')
						.add({
							type: data.event,
							...data.target
						})
				break
			case 'load':
				if (!lastScenario || lastScenario.get('url') !== data.url) {
					if (data.url && data.url.match(/^https?:/)) {
						model.set('url', data.url, { silent: true })
						model.get('scenarios').add(data)
					}
				}
				break
		}
		setTimeout(() => document.querySelector('#addCase').scrollIntoView(), 100)
	}
	onTargetEvent = (event, data) => {
		// console.log(data.type, event, data.url)
	}

	get connected() {
		return this.state.connected
	}

	connect() {
		this.client = io()
		this.client.on('connect', this.onConnect)
		this.client.on('resize', this.onResize)
		this.client.on('frame', this.onUpdate)
		this.client.on('disconnect', this.onDisconnect)
		this.client.on('page.event', this.onPageEvent)
		this.client.on('target.event', this.onTargetEvent)
		if (this.mouseServer === 'java') this.hid = new WebSocket(`ws://${location.hostname}:47664`)
	}
	close() {
		if (this.client.connected) this.client.close()
		if (this.hid && this.hid.readyState === this.hid.OPEN) this.hid.close()
	}
	onConnect = () => {
		this.setState({ connected: true })
		this.drawFrame()
	}
	onDisconnect = () => {
		this.setState({ connected: false })
	}
	onResize = ({ width, height }, callback) => {
		this.setState({ width, height })
	}
	onUpdate = ({ type, src, x, y, width, height }, image) => {
		// console.log('received frame')
		this.queue.push({ type, src, x, y, width, height, image })
		this.drawFrame()
	}

	drawFrame() {
		if (this.busy) return
		this.busy = true
		requestAnimationFrame(async () => {
			const queue = this.queue.splice(0, 5)
			if (queue.length) {
				// console.log('draw frame', queue.length)
				for (let rect of queue) {
					await this.drawRect(rect)
				}
			}
			this.busy = false
			if (this.queue.length) this.drawFrame()
			else this.api('update')
		})
	}
	drawRect({ type, src, x, y, width, height, image }) {
		return new Promise(resolve => {
			switch (type) {
				case 'copy':
					const data = this.ctx.getImageData(src.x, src.y, width, height)
					this.ctx.putImageData(data, x, y)
					resolve()
					break
				case 'raw':
					const img = new Image()
					img.onload = e => {
						this.ctx.drawImage(img, x, y, width, height)
						resolve()
					}
					img.src = 'data:image/png;base64,' + btoa(image)
					break
			}
		})
	}

	// Pointer
	handleKey = e => {
		if (!this.state.connected) return
		const key = e.key
		const { activeKeys } = this
		switch (e.type) {
			case 'keydown':
				e.preventDefault()
				if (!e.repeat) {
					activeKeys.push(key)
					this.api('key', key, 1)
				}
				break
			case 'keyup':
				activeKeys.slice(activeKeys.indexOf(key), 1)
				this.api('key', key, 0)
				break
		}
	}
	handlePointer = event => {
		const e = event.nativeEvent
		e.preventDefault()
		if (!this.connected) return
		const canvas = this.canvas.current
		const scale = canvas.offsetWidth / this.state.width
		const x = Math.round(e.offsetX / scale)
		const y = Math.round(e.offsetY / scale)
		const btn = e.which
		this.sendPointer(e.type, x, y, btn)
		if (e.type === 'mousedown') this.canvas.current.focus()
	}
	handleMouseLeave = () => {
		this.sendJavaInput('MU 1; MU 2; MU 3;')
	}
	releaseKeys = () => {
		while (this.activeKeys.length) {
			const key = this.activeKeys.pop()
			this.api('key', key, 0)
		}
	}
	handleContextMenu = e => {
		e.preventDefault()
	}
	handleResize = () => {
		const inner = this.canvas.current
		const outer = this.canvas.current.parentNode
		this.scale = Math.min(1, Math.min(outer.offsetWidth / inner.width, outer.offsetHeight / inner.height))
		inner.style.transform = `translate(-50%, -50%) scale(${this.scale})`
	}
	sendPointer = (type, x, y, btn) => {
		if (!this.connected) return
		switch (this.mouseServer) {
			case 'java':
				switch (type) {
					case 'mousemove':
						this.sendJavaInput(`MV ${x},${y}`)
						break
					case 'mouseup':
						this.sendJavaInput(`MV ${x},${y}`)
						this.sendJavaInput(`MU ${btn}`)
						break
					case 'mousedown':
						this.sendJavaInput(`MV ${x},${y}`)
						this.sendJavaInput(`MD ${btn}`)
						break
				}
				break
			case 'rfb':
				switch (type) {
					case 'mousemove':
						this.api('pointer', x, y, this.mouseMask)
						break
					case 'mouseup':
						this.mouseMask = Viewport.MOUSE_MASK[0]
						this.api('pointer', x, y, this.mouseMask)
						break
					case 'mousedown':
						this.mouseMask = Viewport.MOUSE_MASK[btn]
						this.api('pointer', x, y, this.mouseMask)
						break
				}
				break
		}
	}

	sendPointerDelay = _.throttle((...args) => this.sendPointer(...args), 100)

	static keyFromCode(code) {
		// a-z & 0-9 - US Keyboard
		if ((code >= 65) & (code <= 90) || (code >= 48) & (code <= 57)) {
			return String.fromCharCode(code).toUpperCase()
		} else {
			return Viewport.JAVA_KEYMAP[code]
		}
	}

	// Interface
	async api(cmd, ...args) {
		return new Promise((resolve, reject) => {
			if (!this.connected) reject()
			else
				this.client.emit(cmd, ...args, res => {
					resolve(res)
				})
		})
	}
	async sendJavaInput(cmd) {
		if (this.hid && this.hid.readyState === this.hid.OPEN) {
			this.hid.send(cmd)
		}
	}
	eval(script, args) {
		return new Promise((resolve, reject) => {
			this.api('page.eval', script, args).then(res => {
				if (res.success) resolve(res.result)
				else reject(res.error)
			})
		})
	}

	render() {
		if (!this.connected) {
			return (
				<StyledViewport id="viewport">
					<canvas ref={this.canvas} className="offline" hidden>
						Canvas not supported
					</canvas>
				</StyledViewport>
			)
		}
		return (
			<StyledViewport id="viewport">
				<canvas
					tabIndex={1}
					className="online"
					ref={this.canvas}
					width={this.state.width}
					height={this.state.height}
					onBlur={this.releaseKeys}
					onKeyDown={this.handleKey}
					onKeyUp={this.handleKey}
					onMouseDown={this.handlePointer}
					onMouseMove={this.handlePointer}
					onMouseUp={this.handlePointer}
					onMouseLeave={this.handleMouseLeave}
					onContextMenu={this.handleContextMenu}
				>
					Canvas not supported
				</canvas>
			</StyledViewport>
		)
	}
}
