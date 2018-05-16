module.exports = {
	plugins: [
		require("autoprefixer")({
			browsers: [
				"> 5%", "last 5 versions"
			]
		})
	]
}