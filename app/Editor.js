import React, { Component } from 'react'
import Types from 'prop-types'
import styled from 'styled-components'
import RFB from 'lib/novnc/core/rfb'
import Toolbar from 'Toolbar'
import io from 'socket.io-client'
import { getClickPoint } from 'lib/utils'
import * as hid from 'lib/hid'

global.hid = hid

const StyledEditor = styled.div`
	width: 100%;
	height: 100%;

	display: flex;
	flex-flow: column nowrap;
	position: relative;

	> section {
		flex: 1;
		width: 100%;
		margin-top: 40px;
		position: relative;

		> div {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
		}
	}
`
export default class Editor extends Component {
	static propTypes = {
		secured: Types.bool
	}
	static defaultProps = {
		secured: false
	}
	wrapperRef = React.createRef()
	viewport = React.createRef()
	screen = React.createRef()
	canvas = React.createRef()
	container = React.createRef()

	state = {
		url: null,
		name: '',
		connected: false,
		clipboard: ''
	}
	noScale

	actions = new Set()

	get _context() {
		return this.canvas.current.getContext('2d')
	}

	async play() {
		this.playing = true
		for (let event of this.actions.values()) {
			await this.api('dispatch', event)
		}
		this.playing = false
	}

	componentDidMount() {
		global.vp = this
		this.socket = io('/builder')
		this.socket.on('rfb_port', this.changeRfbPort)
		this.socket.on('capture', this.handleCapture)
		this.socket.on('event', this.handlePageEvent)
		this.socket.on('dialog', this.handlePageDialog)
		addEventListener('resize', this.handleResize)
		this.handleResize()
	}
	componentDidUpdate(prevProps, prevState) {
		this.updateRfbOptions()
	}
	componentWillUnmount() {
		if (this.rfb) {
			this.rfb.disconnect()
		}
		removeEventListener('resize', this.handleResize)
		Reflect.deleteProperty(this, 'rfb')
	}

	changeRfbPort = port => {
		this.initializeRfb(port)
	}
	handlePageDialog = (type, message) => {
		this.socket.emit('dialog', true)
	}
	handlePageEvent = (type, ...args) => {
		console.log(
			`%cEXPECT %c:: %c${type} = %c${args.join('\t')}`,
			'color: green;',
			'color: grey;',
			'color: black; font-weight: bold;',
			'color: grey;'
		)
	}
	handleCapture = async (action, { name, selector, value }) => {
		if (this.busy) return
		console.log(
			`%cACTION %c:: %c${action} : %c${name} -->`,
			'color: darkgrey;',
			'color: grey;',
			'color: black; font-weight: bold;',
			'color: grey;',
			value
		)
		if (action.startsWith('pointer') || action.startsWith('drag') || action === 'drop') {
			console.log(action)
			this.actions.add(async () => {
				const { failed, x, y } = await this.eval(getClickPoint, selector, ...value)
				if (failed) return
				hid.send(`MV ${x},${y}`)
				switch (action) {
					case 'pointerdown':
					case 'dragstart':
					case 'dragenter':
						hid.send(`MD 1`)
						break
					case 'pointerup':
					case 'drop':
						hid.send(`MU 1`)
						break
				}
			})
		}
	}
	async run() {
		this.busy = true
		this.actions.forEach(Reflect.apply)
	}

	initializeRfb(port) {
		const target = this.screen.current
		const url = `ws://${location.hostname}:${port}`
		this.rfb = new RFB(target, url, { shared: true })
		this.rfb.addEventListener('connect', this.onRfbConnect)
		this.rfb.addEventListener('disconnect', this.onRfbDisconnect)
		this.rfb.addEventListener('credentialsrequired', this.onRfbAuthRequest)
		this.rfb.addEventListener('securityfailure', this.onRfbSecurityFailure)
		this.rfb.addEventListener('capabilities', this.onRfbCapabilities)
		this.rfb.addEventListener('desktopname', this.onRfbName)
		this.rfb.addEventListener('clipboard', this.onRfbClipboard)
		this.rfb.addEventListener('bell', this.onRfbBell)
	}
	updateRfbOptions() {
		if (this.rfb) {
			this.rfb.viewOnly = false
			this.rfb.scaleViewport = true
		}
	}
	onRfbConnect = () => {
		this.setState({ connected: true })
		this.handleResize()
		this.updateRfbOptions()
	}
	onRfbDisconnect = () => {
		this.rfb._listeners.clear()
		this.setState({
			name: '',
			clipboard: '',
			connected: false
		})
	}
	onRfbAuthRequest = () => {
		if (!this.state.error) {
			this.rfb.sendCredentials({ password: prompt('Enter VNC password') })
		}
	}
	onRfbSecurityFailure = e => {
		console.log('security failed', e.detail)
		this.setState({ error: e.detail })
	}
	onRfbCapabilities = () => {
		console.log('change capabilities')
	}
	onRfbName = e => {
		this.setState({ name: e.detail.name })
	}
	onRfbClipboard = e => {
		this.setState({ clipboard: e.detail.text })
	}
	onRfbBell = () => {
		console.log('bell ring')
	}

	get width() {
		return !this.rfb ? 0 : this.rfb._fb_width
	}
	get height() {
		return !this.rfb ? 0 : this.rfb._fb_height
	}

	handleResize = () => {
		this.updateRfbOptions()
	}

	api(cmd, ...args) {
		return new Promise((resolve, reject) => {
			this.socket.emit(cmd, ...args, res => {
				resolve(res)
			})
		})
	}
	exec(script, args = {}) {
		return new Promise((resolve, reject) => {
			this.api('exec', script, args).then(respond => {
				if (respond.success) {
					resolve(respond.result)
				} else {
					console.log('SERVER.EXEC ERROR:', respond.error)
				}
			})
		})
	}
	eval(func, ...args) {
		return new Promise((resolve, reject) => {
			if (typeof func === 'function') {
				this.api('eval', func.toString(), args).then(respond => {
					if (respond.success) {
						resolve(respond.value)
					} else {
						console.log('SERVER.EVAL ERROR:', respond.error)
					}
				})
			}
		})
	}
	_eval(func, ...args) {
		return new Promise((resolve, reject) => {
			if (typeof func === 'function') {
				this.api('_eval', func.toString(), args).then(respond => {
					if (respond.success) {
						resolve(respond.value)
					} else {
						console.log('PAGE.EVAL ERROR:', respond.error)
					}
				})
			}
		})
	}

	render() {
		return (
			<StyledEditor innerRef={el => (this.wrapperRef.current = el)}>
				<Toolbar editor={this} />
				<section ref={this.container}>
					<div ref={this.screen} />
				</section>
			</StyledEditor>
		)
	}
}
