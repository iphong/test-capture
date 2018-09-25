import React from 'react'
import Types from 'prop-types'
import debounce from 'lodash/debounce'
import isFunction from 'lodash/isFunction'

export class ModelResponder extends React.Component {
	static propTypes = {
		target: Types.object,
		bind: Types.arrayOf(Types.string),
		onMount: Types.func,
		onUpdate: Types.func,
		children: Types.func
	}
	componentDidMount() {
		this.subscribe()
		if (typeof this.props.onMount === 'function') this.props.onMount()
	}
	componentDidUpdate() {
		this.unsubscribe()
		this.subscribe()
		if (typeof this.props.onUpdate === 'function') this.props.onUpdate()
	}
	componentWillUnmount() {
		this.unsubscribe()
	}
	update = debounce(() => this.forceUpdate())
	subscribe() {
		if (this.props.bind) {
			this.props.bind.forEach(attr => {
				this.props.target.on('change:' + attr, this.update, this)
			})
		} else {
			this.props.target.on('change', this.update, this)
		}
		this.props.target.on('sync', this.update, this)
	}
	unsubscribe() {
		this.props.target.off(null, null, this)
	}
	render() {
		if (!isFunction(this.props.children))
			return null
		const args = this.props.bind ? this.props.bind.map(attr => this.props.target.get(attr)) : [this.props.target]
		return this.props.children(...args) || null
	}
}

export class CollectionResponder extends React.PureComponent {
	static propTypes = {
		target: Types.object,
		bind: Types.arrayOf(Types.string),
		onMount: Types.func,
		onUpdate: Types.func,
		children: Types.func
	}
	componentDidMount() {
		this.subscribe()
		if (typeof this.props.onMount === 'function') this.props.onMount()
	}
	componentDidUpdate() {
		this.unsubscribe()
		this.subscribe()
		if (typeof this.props.onUpdate === 'function') this.props.onUpdate()
	}
	componentWillUnmount() {
		this.unsubscribe()
	}
	update = debounce(() => this.forceUpdate())
	subscribe() {
		if (this.props.bind)
			this.props.bind.forEach(attr => {
				this.props.target.on('change:' + attr, this.update, this)
			})
		this.props.target.on('add remove update reset sort sync', this.update, this)
	}
	unsubscribe() {
		this.props.target.off(null, null, this)
	}
	render() {
		if (!isFunction(this.props.children))
			return null
		return this.props.children(this.props.target) || null
	}
}
