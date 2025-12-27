const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: "./src/index.js",

	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},

	devServer: {
		static: path.resolve(__dirname, "dist"),
		open: true,
		hot: true,
		historyApiFallback: true,
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/template.html",
		}),
	],

	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
		],
	},
};
