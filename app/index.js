import React from 'react'
import ReactDOM from 'react-dom'
import App from 'App'

import * as dom from 'dom'

global.dom = dom

ReactDOM.render(<App />, document.querySelector('#root'))
