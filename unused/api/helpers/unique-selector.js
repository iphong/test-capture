window._uniqueSelector = (function(t) {
	var e = {}
	function n(r) {
		if (e[r]) return e[r].exports
		var o = (e[r] = { i: r, l: !1, exports: {} })
		return t[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports
	}
	return (
		(n.m = t),
		(n.c = e),
		(n.d = function(t, e, r) {
			n.o(t, e) || Object.defineProperty(t, e, { configurable: !1, enumerable: !0, get: r })
		}),
		(n.r = function(t) {
			Object.defineProperty(t, '__esModule', { value: !0 })
		}),
		(n.n = function(t) {
			var e =
				t && t.__esModule
					? function() {
							return t.default
					  }
					: function() {
							return t
					  }
			return n.d(e, 'a', e), e
		}),
		(n.o = function(t, e) {
			return Object.prototype.hasOwnProperty.call(t, e)
		}),
		(n.p = ''),
		n((n.s = 0))
	)
})([
	function(t, e, n) {
		'use strict'
		function r(t) {
			const e = t.getAttribute('id')
			return e !== null && e !== '' ? `#${e}` : null
		}
		function o(t) {
			return (function(t) {
				if (!t.hasAttribute('class')) return []
				try {
					return Array.prototype.slice.call(t.classList)
				} catch (e) {
					let n = t.getAttribute('class')
					return (n = n.trim().replace(/\s+/g, ' ')).split(' ')
				}
			})(t)
				.filter(Boolean)
				.map(t => `.${t}`)
		}
		function u(t, e, n, r, o, l, c) {
			if (l !== c)
				for (let i = r; i <= o && o - i + 1 >= c - l; ++i) (n[l] = e[i]), u(t, e, n, i + 1, o, l + 1, c)
			else t.push(n.slice(0, l).join(''))
		}
		function l(t) {
			let e
			return (e =
				typeof HTMLElement === 'object'
					? t instanceof HTMLElement
					: !!t && typeof t === 'object' && t.nodeType === 1 && typeof t.nodeName === 'string')
		}
		function c(t) {
			let e,
				n,
				r = 0
			const { parentNode: o } = t
			if (o) {
				const { childNodes: u } = o,
					c = u.length
				for (e = 0; e < c; e++) if (l((n = u[e])) && (r++, n === t)) return `:nth-child(${r})`
			}
			return null
		}
		function i(t) {
			return t.tagName.toLowerCase().replace(/:/g, '\\:')
		}
		function s(t, e) {
			if (!e) return !1
			const n = t.ownerDocument.querySelectorAll(e)
			return n.length === 1 && n[0] === t
		}
		function a(t, e) {
			const { parentNode: n } = t,
				r = n.querySelectorAll(e)
			return r.length === 1 && r[0] === t
		}
		function f(t, e) {
			return e.find(a.bind(null, t))
		}
		function d(t, e, n) {
			let r = (function(t, e) {
					const n = [],
						r = t.length,
						o = []
					for (var l = 1; l <= e; ++l) u(n, t, o, 0, r - 1, 0, l)
					return n
				})(e, 3),
				o = f(t, r)
			return o ? o : Boolean(n) && ((o = f(t, (r = r.map(t => n + t)))), Boolean(o)) ? o : null
		}
		function p(t, e, n) {
			let u
			const l = (function(t, e, n) {
				const u = {
					Tag: i,
					NthChild: c,
					Attributes: t =>
						(function(t, e = ['id', 'class', 'length']) {
							const { attributes: n } = t
							return [...n].reduce(
								(t, n) => (e.indexOf(n.nodeName) > -1 || t.push(`[${n.nodeName}="${n.value}"]`), t),
								[]
							)
						})(t, n),
					Class: o,
					ID: r
				}
				return e.reduce((e, n) => ((e[n] = u[n](t)), e), {})
			})(t, e, n)
			for (let n of e) {
				const { ID: e, Tag: r, Class: o, Attributes: c, NthChild: i } = l
				switch (n) {
					case 'ID':
						if (Boolean(e) && a(t, e)) return e
						break
					case 'Tag':
						if (Boolean(r) && a(t, r)) return r
						break
					case 'Class':
						if (Boolean(o) && o.length && (u = d(t, o, r))) return u
						break
					case 'Attributes':
						if (Boolean(c) && c.length && (u = d(t, c, r))) return u
						break
					case 'NthChild':
						if (i) return i
				}
			}
			return '*'
		}
		function h(t, e = {}) {
			const {
					selectorTypes: n = ['ID', 'Class', 'Tag', 'NthChild'],
					attributesToIgnore: r = ['id', 'class', 'length']
				} = e,
				o = [],
				u = (function(t) {
					const e = []
					let n = t
					for (; l(n); ) e.push(n), (n = n.parentNode)
					return e
				})(t)
			for (let t of u) {
				const e = p(t, n, r)
				Boolean(e) && o.push(e)
			}
			const c = []
			for (let e of o) {
				c.unshift(e)
				const n = c.join(' > ')
				if (s(t, n)) return n
			}
			return null
		}
		n.r(e),
			n.d(e, 'default', function() {
				return h
			})
	}
])
