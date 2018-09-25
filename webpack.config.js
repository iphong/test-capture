const path = require('path')

const common = {
	mode: 'development',
	resolve: {
		modules: [
			path.resolve(__dirname, './lib'),
			path.resolve(__dirname, './app'),
			path.resolve(__dirname, './node_modules')
		]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [/node_modules/],
				use: 'babel-loader?compact&cacheDirectory'
			},
			{
				oneOf: [
					{
						test: /\.css$/,
						use: ['style-loader', 'css-loader']
					},
					{
						loader: require.resolve('file-loader'),
						exclude: [/\.js$/, /\.json$/]
					},
					{
						test: /\.js$/,
						exclude: [/node_modules/],
						use: ['babel-loader?cacheDirectory']
					},
					{
						loader: require.resolve('file-loader'),
						exclude: [/\.js$/, /\.json$/],
						options: {
							name: 'static/[name].[hash:8].[ext]'
						}
					}
					// ** STOP ** Are you adding a new loader?
					// Make sure to add the new loader(s) before the "file" loader.
				]
			}
		]
	}
}
module.exports = [
	{
		entry: './app/index.js',
		output: {
			path: path.resolve(__dirname, './api/public/'),
			filename: 'app.js',
			libraryTarget: 'umd'
		},
		...common
	},
	{
		entry: './app/lib/helper.js',
		output: {
			path: path.resolve(__dirname, './api/'),
			filename: 'helper.js',
			libraryTarget: 'umd'
		},
		...common
	}
]
