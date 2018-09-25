import _ from 'underscore'
import React from 'react'
import Types from 'prop-types'
import styled from 'styled-components'
import { List, Segment } from 'semantic-ui-react'
import Action from 'Action'

export default class Actions extends React.Component {
	render() {
		return (
			<Segment size="tiny" basic>
				<List selection size="tiny" {...this.props} />
			</Segment>
		)
	}
}
