const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/ts/main.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: [/node_modules/, /bin/, /build/, /src/],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "game.js",
    path: path.resolve(__dirname, "src/main/resources/static/js"),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};