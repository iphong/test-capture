import _ from 'underscore'
import React from 'react'
import Types from 'prop-types'
import styled from 'styled-components'
import { List, Segment, Label, Icon } from 'semantic-ui-react'
import { ModelResponder } from 'lib/responders'

export default class Action extends React.Component {
	render() {
		return (
			<ModelResponder target={this.props.model} bind={['title', 'selector', 'type', 'value']}>
				{(title, selector, type, value) => {
					if (['input'].includes(type)) return null
					const active = ['click', 'change', 'visit', 'submit', 'dragstart', 'drop'].includes(type)
					return (
						<List.Item active={active}>
							<Icon name="genderless" />
							<List.Content style={{ whiteSpace: 'nowrap' }}>
								{(mapEventName[type] || type).toUpperCase()} $("<strong>{selector}</strong>") {type === 'change' ? ' = "' + value + '"' : null}
							</List.Content>
						</List.Item>
					)
				}}
			</ModelResponder>
		)
	}
}

const mapEventName = {
	change: 'input',
	dragstart: 'drag'
}