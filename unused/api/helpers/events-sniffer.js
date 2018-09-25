;(function() {
	if (!window.__PF_HELPER_LOADED__) {
		window.__PF_HELPER_LOADED__ = true

		const __unique = window._uniqueSelector.default

		function _ajax(method, url, async = true, data) {
			const req = new XMLHttpRequest()
			req.open(method, url, async)
			return req.send(data)
		}
		function _sendEvent(name, data = {}, async = false) {
			if (name) _ajax('POST', 'http://localhost/event/' + name, async, JSON.stringify(data))
		}

		function _elementsFromPoint(x, y) {
			return document
				.elementsFromPoint(x, y)
				.filter(el => {
					if (['html', 'body'].includes(el.localName)) return false
					return true
				})
				.map(_elementInfo)
		}
		function _selectorFromEvent(e, target, eventName) {
			const { x, y, offsetX, offsetY, pageX, pageY, clientX, clientY } = e
			const frame = target.ownerDocument.defaultView.frameElement
			return {
				event: eventName || e.type,
				target: _elementInfo(target),
				frame: frame ? _elementInfo(frame) : null,
				position: {
					x,
					y,
					offsetX,
					offsetY,
					pageX,
					pageY
				}
			}
		}
		function _elementInfo(el) {
			const { x, y, width, height, top, left, right, bottom } = el.getBoundingClientRect()
			return {
				tagName: el.localName,
				bounds: { x, y, width, height, top, left, right, bottom },
				selector: __unique(el, {
					selectorTypes: ['ID', 'Class', 'Tag', 'NthChild']
				}),
				src: el.src,
				href: el.href,
				value: el.value,
				name: el.name
			}
		}
		// for (let event of [
		// 	'click',
		// 	// 'mousedown',
		// 	// 'mouseup',
		// 	// 'dblclick',
		// 	'dragstart',
		// 	// 'drag',
		// 	'drop',
		// 	'submit',
		// 	'input',
		// 	// 'focus',
		// 	// 'blur',
		// 	'change',
		// 	'scroll'
		// ]) {
		//
		// }
		// addEventListener(
		// 	event,
		// 	e => {
		// 		let target = e.target
		// 		if (event === 'click') {
		// 			if (e.target.matches('a[href],a[href] *')) {
		// 				e.preventDefault()
		// 				if (e.target.localName !== 'a') {
		// 					target = e.path.find(el => el.localName === 'a')
		// 				}
		// 				if (!target.href.match(/^#.*$/g)) {
		// 					_sendEvent('pointer', _selectorFromEvent(e, target, 'visit'))
		// 					setTimeout(() => (window.location = target.href))
		// 					return
		// 				}args
		// 			}
		// 		}
		// 		_sendEvent('pointer', _selectorFromEvent(e, target))
		// 	},
		// 	true
		// )
		addEventListener('mousedown', e => {
			e.preventDefault()
			_sendEvent('pointer', _selectorFromEvent(e, target))
		}, true)
		addEventListener('contextmenu', e => e.preventDefault(), true)
		addEventListener('beforeunload', () => {
			if (!window.frameElement) _sendEvent('unload', { url: location.href }, false)
		})
	}
})()
