function click(selector) {}
function hover(selector) {}
function drag(selector) {}
function drop(selector) {}
function assert() {}
function expect() {}

function run() {
	open('http://bravebits.co')
	click('#open-catalog')
	expect('#open-catalog', 'to.be.visible')
}

run()