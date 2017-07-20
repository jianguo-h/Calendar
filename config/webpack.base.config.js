const path = require("path");

module.exports = {
	entry: {
		index: ["./src/index.js"]
	},
	output: {
		publicPath: "/",
		filename: "js/calendar.min.js",
		path: path.resolve(__dirname, "../dist")
	},
	module: {
		rules: [
			{
				enforce: "pre",
				test: /\.js$/,
				exclude: [
					path.resolve(__dirname, "../dist"),
					path.resolve(__dirname, "../node_modules"),
				],
				use: [
					{
						loader: "eslint-loader",
						options: {
							formatter: require("eslint-friendly-formatter")
						}
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	},
	resolve: {
		extensions: [".js", ".json"]
	}
}