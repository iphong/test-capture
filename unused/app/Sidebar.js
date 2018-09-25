import React from 'react'
import Types from 'prop-types'
import styled from 'styled-components'
import Group from 'Group'
import { Button, Segment } from 'semantic-ui-react'

import model from 'Model'
import { CollectionResponder } from 'lib/responders'

global.model = model

const StyledSideBar = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;
	width: 350px;
	overflow-x: hidden;
	overflow-y: auto;
	z-index: 20;
	background: #dedede;
`
export default class Sidebar extends React.Component {
	static propTypes = {
		actions: Types.array
	}
	render() {
		return (
			<StyledSideBar id="sidebar">
				<Segment basic>
					<CollectionResponder target={model.get('scenarios')}>
						{scenarios => {
							return scenarios.map(scenario => {
								return <Group key={scenario.cid} model={scenario} />
							})
						}}
					</CollectionResponder>
					<a id="addCase" />
				</Segment>
			</StyledSideBar>
		)
	}
}
