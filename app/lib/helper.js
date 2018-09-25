import unique from 'unique-selector'
import specificity from 'specificity'
import io from 'socket.io-client'
import _ from 'lodash'

if (!Reflect.has(global, '__HELPER_SCRIPT_INJECTED')) {
	Reflect.defineProperty(global, '__HELPER_SCRIPT_INJECTED', { value: true })
	const socket = io('ws://localhost/helper')
	function send(...args) {
		if (socket.connected) {
			socket.send(global.__BUILDER_DISPLAY, ...args)
		}
	}
	const events = [
		'keydown',
		'keyup',

		'pointerdown',
		// 'pointermove',
		'pointerup',

		'dragstart',
		'drop',

		'select',
		'change',
		'submit'
	]
	for (let type of events) {
		if (type === 'pointermove') addEventListener(type, _.throttle(handler, 100), true)
		else addEventListener(type, handler, true)
	}
	function handler(e) {
		const { element, selector, name } = getSelector(e.path)
		const rect = _.pick(element.getBoundingClientRect(), 'top', 'left', 'width', 'height')
		const data = { name, selector, rect }

		if (e.type.startsWith('pointer') || e.type.startsWith('drag') || e.type === 'drop') {
			if (e.type === 'pointermove' && !e.buttons) {
				return
			}
			data.value = [round(e.offsetX / rect.width), round(e.offsetY / rect.height)]
		}
		if (e.type.startsWith('key')) {
			data.value = e.key
		}
		if (e.type === 'change') {
			data.value = e.target.value
		}
		send(e.type, data)
	}
	function round(number, decimal = 3) {
		const m = Math.pow(10, decimal)
		return Math.min(0.999, Math.max(0.001, Math.round(number * m) / m))
	}
	function getName(element) {
		return element.nodeName
	}
	function getSelector(items) {
		let selector
		const element = items.find(el => (selector = unique(el)))
		return {
			element,
			selector: getFrame(element, selector),
			name: getName(element)
		}
	}
	function getFrame(el, current) {
		const doc = el.ownerDocument
		if (doc) {
			const frame = doc.defaultView.frameElement
			if (frame) {
				const parentDoc = frame.ownerDocument
				if (parentDoc) {
					// const index = [...parentDoc.querySelectorAll('iframe').values()].indexOf(frame)
					return getFrame(frame, `${unique(frame)} | ${current}`)
				}
			}
		}
		return current
	}
}

export default null