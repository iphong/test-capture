
import { Model, Collection } from 'backbone-x'
import _ from 'underscore'

const Rect = Model({
	width: 1280,
	height: 720
})
const Cookie = Model({
	name: '_js_reg_fb_ref',
	value: 'https%3A%2F%2Fwww.facebook.com%2F',
	domain: '.facebook.com',
	path: '/',
	expires: -1,
	size: 47,
	httpOnly: false,
	secure: true,
	session: true
})
const TestAction = Model({
	frame: '',
	query: '',
	eventType: '',
	eventData: {},
	dataTransfer: {}
})

const TestCase = Model({
	url: 'http://facebook.com',
	title: 'It should...',
	description: 'Describe it',
	sequence: Collection(TestAction)
})
const TestSuite = Model({
	// https://apps.pagefly.io/index.php?shop=iphong.myshopify.com&task=add-page
	url: 'about:blank',
	viewport: Rect,
	cookies: Collection(Cookie),
	userAgent: null,
	commandTimeout: 5000,
	pageLoadTimeout: 30000,

	scenarios: Collection(TestCase)
})

const model = new TestSuite()
let savedData
try {
	savedData = JSON.parse(localStorage.getItem('sample-test-data'))
} catch (e) {}

if (savedData) model.set(savedData)
model.on('change', _.debounce(() => {
	localStorage.setItem('sample-test-data', JSON.stringify(model.toJSON()))
}, 5))

export default model
