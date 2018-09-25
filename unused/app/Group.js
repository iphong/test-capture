import _ from 'underscore'
import React from 'react'
import Types from 'prop-types'
import styled from 'styled-components'
import Actions from 'Actions'
import Action from 'Action'
import { Header, Icon } from 'semantic-ui-react'
import { ModelResponder } from 'lib/responders'

export default class Group extends React.Component {
	static propTypes = {
		model: Types.object
	}
	static defaultProps = {}
	state = {}
	componentDidMount() {}
	render() {
		return (
			<ModelResponder target={this.props.model} bind={['title', 'url', 'sequence']}>
				{(title, url, sequence) => {
					return (
						<React.Fragment>
							<Header
								size="small"
								onDoubleClick={e => {
									if (confirm('Delete?')) this.props.model.collection.remove(this.props.model)
								}}
							>
								<Icon name="magic" />
								<Header.Content>
									{title}
									<Header.Subheader>{url}</Header.Subheader>
								</Header.Content>
							</Header>
							<Actions>{sequence.map(action => <Action key={action.cid} model={action} />)}</Actions>
						</React.Fragment>
					)
				}}
			</ModelResponder>
		)
	}
}
