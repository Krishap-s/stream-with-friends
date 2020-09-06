var path = require("path");

module.exports = {
	mode:'production',
	output: {
		filename: '[name].bundle.js',
		chunkFilename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module:{
		rules:[
			{
				enforce: 'pre',
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'eslint-loader',
				options: {
					fix:true,
					formatter: 'stylish'
				}
			},
			{
				test:/\.(handlebars)$/,
				loader: 'handlebars-loader',
			},
		]
	}
}
