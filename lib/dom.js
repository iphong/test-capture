/**
 * is interactive type
 * @param element
 * @return {boolean}
 */
export function isInteractive(element) {
	return true
}

/**
 * is embed type
 * @param element
 * @return {boolean}
 */
export function isEmbed(element) {
	return true
}

/**
 * is heading type
 * @param element
 * @return {boolean}
 */
export function isHeading(element) {
	return true
}

/**
 * is layout type
 * @param element
 * @return {boolean}
 */
export function isLayout(element) {
	return true
}

export function $x(expression, element = document.body) {
	return document.evaluate(expression, element)
}