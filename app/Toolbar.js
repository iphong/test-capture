import React, { Component } from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'
import Types from 'prop-types'
import { toggleFullScreen } from 'lib/utils'

const links = [
	{
		text: 'Site 01',
		value: 'http://localhost/example/site.01.html'
	},
	{
		text: 'JoomlaShine HomePage',
		value: 'http://www.joomlashine.com'
	},
	{
		text: 'BraveBits HomePage',
		value: 'http://bravebits.co'
	},
	{
		text: 'PageFly New Page',
		value: 'https://apps.pagefly.io/index.php?shop=iphong.myshopify.com&task=edit-page'
	},
	{
		text: 'PageFly Edit Existing Page',
		value: 'https://apps.pagefly.io/index.php?shop=iphong.myshopify.com&task=edit-page&id=126953'
	}
]
const page_element_at_point = (x, y) => {
	return x + y
}
export default class Toolbar extends Component {
	static propTypes = {
		editor: Types.instanceOf(Component).isRequired
	}
	get editor() {
		return this.props.editor
	}
	handleChangeLinks = (e, { value }) => {
		this.editor.api('launch', value)
	}
	getElementAtPoint = e => {
		this.editor.eval(page_element_at_point, 100, 100).then(console.log)
	}
	handleFullScreen = () => {
		toggleFullScreen(this.editor.wrapperRef.current)
	}
	exec = (...args) => () => this.editor.exec(...args)
	render() {
		return (
			<Menu fixed="top" inverted>
				<Menu.Item header content="TestBuilder" />

				<Dropdown item text="Pages" options={links} onChange={this.handleChangeLinks} />
				<Menu.Item content="Click" />
				<Menu.Item content="Hover" />

				<Menu.Menu position="right">
					<Dropdown item text="Assertion">
						<Dropdown.Menu>
							<Dropdown.Item text="Page Title" />
							<Dropdown.Item text="Integrity" />
							<Dropdown.Item text="Performance" />
							<Dropdown.Item text="Property" />
							<Dropdown.Item text="Styling" />
							<Dropdown.Item text="Content" />
							<Dropdown.Item text="Position" />
							<Dropdown.Item text="Visibility" />
							<Dropdown.Item text="Accessibility" />
							<Dropdown.Item text="Quantity" />
							<Dropdown.Item text="ScreenShot" />
							<Dropdown.Item text="Custom" />
						</Dropdown.Menu>
					</Dropdown>
					<Dropdown item text="Perform">
						<Dropdown.Menu>
							<Dropdown.Item text="Mouse Click" />
							<Dropdown.Item text="Mouse Hover" />
							<Dropdown.Item text="Drag Hold" />
							<Dropdown.Item text="Drag Over" />
							<Dropdown.Item text="Drop Release" />
							<Dropdown.Divider />
							<Dropdown.Item text="Precision Drag & Drop" />
							<Dropdown.Item text="Multi-touch Gestures" />
						</Dropdown.Menu>
					</Dropdown>
					<Menu.Item onClick={this.handleFullScreen} icon="expand" />
				</Menu.Menu>
			</Menu>
		)
	}
}
