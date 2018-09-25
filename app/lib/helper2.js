import unique from 'unique-selector'
import specificity from 'specificity'
import io from 'socket.io-client'

if (!Reflect.has(global, '__HELPER_SCRIPT_INJECTED')) {
	Reflect.defineProperty(global, '__HELPER_SCRIPT_INJECTED', { value: true })
	const socket = io('ws://localhost/helper')
	function send(...args) {
		if (socket.connected) {
			socket.send(global.__BUILDER_DISPLAY, ...args)
		}
	}
	function info(element) {
		const type = XPathResult.FIRST_ORDERED_NODE_TYPE
		const find = path => document.evaluate(path, element, null, type).singleNodeValue
		let node

		if ((node = find('ancestor-or-self::a[@id or @href or (@href and descendant::text())]')))
			return {
				...common(node),
				type: 'link',
				href: node.getAttribute('href') || undefined,
				text: node.textContent.trim() || undefined
			}

		if ((node = find('self::input[@name or @id]')))
			return {
				...common(node),
				name: node.name || undefined,
				value: node.value || undefined
			}

		// if ((node = find('self::img[@id or (@src or @alt)]')))
		// 	return {
		// 		...common(node),
		// 		alt: node.alt || undefined,
		// 		src: node.src || undefined
		// 	}
	}
	function common(node) {
		return {
			id: node.id || undefined,
			tag: node.localName
		}
	}
	function position(e) {
		return {
			x: e.offsetX,
			y: e.offsetY
		}
	}
	const events = ['mousedown', 'mouseup', 'dragstart', 'input', 'drop', 'change']
	const chained = []
	for (let event of events) {
		addEventListener(
			event,
			e => {
				switch (e.type) {
					case 'mousedown':
						chained.length = 0
						chained.push(e)
						break
					case 'mouseup':
						if (chained.length === 1)
							send(
								'click',
								getFrame(e.target, getElement(e.path)),
								getFactor(e.offsetX, e.target.offsetWidth),
								getFactor(e.offsetY, e.target.offsetHeight)
							)
						break
					case 'dragstart':
						send(
							'drag',
							getFrame(e.target, getElement(e.path)),
							getFactor(e.offsetX, e.target.offsetWidth),
							getFactor(e.offsetY, e.target.offsetHeight)
						)
						break
					case 'drop':
						send(
							'drop',
							getFrame(e.target, getElement(e.path)),
							getFactor(e.offsetX, e.target.offsetWidth),
							getFactor(e.offsetY, e.target.offsetHeight)
						)
						break
					case 'input':
						send('input', getFrame(e.target, getElement(e.path)), e.key)
						break
					case 'change':
						send('change', getFrame(e.target, getElement(e.path)), e.target.value)
						break
				}
			},
			true
		)
	}
	function getFactor(a, b) {
		if (b === 0) return '0.00'
		return (a / b).toFixed(2)
	}
	function getElement(items) {
		let selector
		const element = items.find(el => (selector = unique(el)))
		return selector
	}
	function getFrame(el, current) {
		const doc = el.ownerDocument
		if (doc) {
			const frame = doc.defaultView.frameElement
			if (frame) {
				const parentDoc = frame.ownerDocument
				if (parentDoc) {
					const index = [...parentDoc.querySelectorAll('iframe').values()].indexOf(frame)
					return getFrame(frame, `iframe[${index}] | ${current}`)
				}
			}
		}
		return current
	}
	// addEventListener(
	// 	'click',
	// 	e => {
	// 		if (global.__HELPER_NO_CAPTURE) return
	// 		if (!e.metaKey) {
	// 			e.stopImmediatePropagation()
	// 			e.preventDefault()
	// 			const { selector } = findSelectorIn(e.path)
	// 			try {
	// 				const el = info(document.elementFromPoint(e.clientX, e.clientY))
	// 				if (el) {
	// 					send({
	// 						event: e.type,
	// 						...position(e),
	// 						...el,
	// 						selector
	// 					})
	// 				} else {
	// 					send({
	// 						event: e.type,
	// 						...position(e),
	// 						selector
	// 					})
	// 				}
	// 			} catch (e) {}
	// 		}
	// 	},
	// 	true
	// )
}

function test1() {
	const eventNames = {
		Form: ['change', 'input', 'search', 'submit', 'reset'],
		Mouse: ['click', 'mousedown', 'mousemove', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'mouseup'],
		Keyboard: ['keydown', 'keyup', 'keypress'],
		Drag: ['dragstart', 'dragenter', 'dragover', 'dragout', 'dragleave', 'dragend', 'dragcancel', 'drop'],
		Focus: [
			/*'blur', 'focus', 'focusin', 'focusout'*/
		]
	}
	eventNames.all = [
		...eventNames.Form,
		...eventNames.Mouse,
		...eventNames.Keyboard,
		...eventNames.Drag,
		...eventNames.Focus
	]
	eventNames.entries = Object.entries(eventNames)
	const eventKeys = [
		'pageX',
		'pageY',
		'offsetX',
		'offsetY',
		'layerX',
		'layerY',
		'screenX',
		'screenY',
		'clientX',
		'clientY',
		'deltaX',
		'deltaY',
		'deltaZ',
		'deltaMode',
		'MovementX',
		'MovementY',
		'button',
		'buttons',
		'altKey',
		'shiftKey',
		'ctrlKey',
		'metaKey',
		'key',
		'code',
		'keyCode',
		'composed',
		'url',
		'total',
		'loaded',
		'data',
		'inputType',
		'isComposing',
		'repeat',
		'which',
		'timeStamp'
	]
	const targetAttrs = [
		'id',
		'name',
		'href',
		'value',
		'src',
		'title',
		'alt',
		'disabled',
		'hidden',
		'tagName',
		'className'
	]
	const frameAttrs = ['name', 'href']

	for (let type of eventNames.all) {
		addEventListener(type, handler, true)
	}
	function handler(e) {
		if (e.target.matches('input[type=file]')) {
			e.preventDefault()
			e.stopImmediatePropagation()
			console.log('file input open')
		}
		// e.stopImmediatePropagation()
		const { type } = e
		const { selector, element } = findSelectorIn(e.path)
		if (selector) {
			const payload = {
				selector,
				type,
				data: pick(e, eventKeys),
				frame: frameOf(element),
				score: calculateSelectorScore(selector)
			}
			if (element.matches('input')) payload.value = element.value
			send(payload)
			// const group = getEventGroup(e.type)
			// const event = pick(e, eventKeys)
			// const attrs = pick(element, targetAttrs)
			// const rect = getBound(element)
			// const frame = frameOf(element)
			// const score = calculateSelectorScore(selector)
			// send({ group, event, selector, attrs, rect, frame, score })
		}
	}
	function getEventGroup(type) {
		return eventNames.entries.find(([group, items]) => items.includes(type))[0]
	}
	function findSelectorIn(items) {
		let selector
		const element = items.find(el => (selector = unique(el)))
		return { selector, element }
	}
	function getBound(element) {
		return pick(element.getBoundingClientRect(), ['top', 'left', 'width', 'height', 'bottom', 'right'])
	}
	function frameOf(element) {
		const frame = element.ownerDocument.defaultView.frameElement
		if (frame) {
			const data = pick(frame, frameAttrs)
			data.selector = unique(frame)
			// data.rect = getBound(frame)
			return data
		}
		return null
	}
	function calculateSelectorScore(selector) {
		const parts = selector.replace(/>/g, '').split(/\s+/).length
		const score = specificity.calculate(selector)[0].specificityArray.join('')
		return Math.min(100, Math.round(score / parts))
	}
	function pick(obj, keys) {
		const output = {}
		for (let key of keys) {
			if (Reflect.has(obj, key)) output[key] = obj[key]
		}
		return output
	}
}
