import React from 'react'
import styled from 'styled-components'
import Editor from 'Editor'
import io from 'socket.io-client'

const StyledApp = styled.main`
	font-family: 'Helvetica Neue', sans-serif;
	font-size: 13px;
	line-height: 1.5em;

	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;

	background: #ccc;
`
export default class App extends React.Component {
	static propTypes = {}
	static defaultProps = {}
	state = {
		showEditor: true
	}
	componentDidMount() {
		global.app = this
	}
	render() {
		return (
			<StyledApp>
				{this.state.showEditor ? <Editor /> : null}
			</StyledApp>
		)
	}
}
