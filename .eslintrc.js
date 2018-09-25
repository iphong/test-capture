const path = require('path')

module.exports = {
	parser: 'babel-eslint',
	env: {
		browser: true,
		es6: true,
		node: true
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2017
	},
	extends: ['react', 'plugin:flowtype/recommended', 'prettier'],
	plugins: ['react', 'flowtype', 'prettier'],
	rules: {
		'prettier/prettier': [
			1,
			{ singleQuote: true, tabWidth: 4, useTabs: true, semi: false, printWidth: 120 }
		],
		'camelcase': 0,
		'react/sort-comp': 0,
		'no-unused-expressions': 1,
		'react/jsx-no-undef': 1,
		'one-var': [1, { 'initialized': 'never' }],
		'no-unused-vars': 1,
		'new-cap': 0,
		'prefer-reflect': 1,
		'no-proto': 1,
		'no-use-before-define': 1,
		'max-nested-callbacks': 0,
		'radix': 1,
		'react/forbid-prop-types': 1,
		'no-empty': 1,
		'no-eval': 0,
		'no-return-assign': 1,
		'no-nested-ternary': 1,
		'no-void': 1,
		'eqeqeq': 1,
		'react/no-did-update-set-state': 1,
		'no-constant-condition': 1,
		'no-irregular-whitespace': 1,
		'no-script-url': 1
	},
	settings: {
		'import/resolver': {
			webpack: {
				config: path.resolve(__dirname, './webpack.config.js')
			}
		}, 'flowtype': {
			'onlyFilesWithFlowAnnotation': true
		}
	}
}
