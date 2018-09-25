export function toggleFullScreen(element) {
	if (document.webkitIsFullScreen) document.webkitCancelFullScreen()
	else element.webkitRequestFullScreen()
}

export function getClickPoint(selector, offsetX = 0.5, offsetY = 0.5) {
	let doc = document
	let x = 0
	let y = 0
	const parts = selector.split(/\s*\|\s*/g)
	const target = parts.pop()
	while (parts.length) {
		const frame = parts.shift()
		const frameEl = doc.querySelector(frame)
		if (frameEl) {
			frameEl.scrollIntoView(false)
			const rect = frameEl.getBoundingClientRect()
			doc = frameEl.contentDocument
			x += rect.left
			y += rect.top
		} else return { failed: true }
	}

	// x += screenX + (outerWidth - innerWidth) + scrollX
	// y += screenY + (outerHeight - innerHeight) + scrollY

	const targetEl = doc.querySelector(target)
	if (targetEl) {
		targetEl.scrollIntoView(false)
		const rect = targetEl.getBoundingClientRect()
		x += rect.width * offsetX
		x += rect.left
		y += rect.height * offsetY
		y += rect.top

		return { x: Math.round(x || 0), y: Math.round(y || 0) }
	}
	return { failed: true }
}

function drawCrossHair(canvas, x, y) {
	const ctx = canvas.getContext('2d')
	if (ctx) {
		const ci = 20
		const le = 30
		const ls = 10
		ctx.strokeStyle = '#000'
		ctx.arc(x, y, ci, 0, Math.PI * 2)

		ctx.lineWidth = 3
		ctx.stroke()

		ctx.moveTo(x, y - le)
		ctx.lineTo(x, y - ls)

		ctx.moveTo(x, y + le)
		ctx.lineTo(x, y + ls)

		ctx.moveTo(x + le, y)
		ctx.lineTo(x + ls, y)

		ctx.moveTo(x - le, y)
		ctx.lineTo(x - ls, y)

		ctx.lineWidth = 1
		ctx.stroke()
	}
}
