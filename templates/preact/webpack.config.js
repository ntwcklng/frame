const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postcssImport = require('postcss-import');
const postcssUrl = require('postcss-url');
const autoprefixer = require('autoprefixer');
const precss = require('precss');

const PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
}

module.exports = {
    devtool: "source-map",
    entry: PATHS.src,
    output: {
        path: PATHS.build,
        filename: "bundle.js"
    },
    devServer: {
        contentBase: "build/",
        publicPath: "/",
        historyApiFallback: true,
        stats: 'errors-only'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                include: PATHS.src,
                loaders: [
                    'style',// inserts raw css into styles elements.
                    'css', // css-loader parses css files resolves url() expressions.
                    'sass', // sass-loader for sass compilation
                    'postcss' // for whatever we have defined in postcss( ) below
                ]
            },
            {
                test: /\.js?$/,
                include: PATHS.src,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },
    postcss: function(webpack) {
        return [autoprefixer, precss, postcssImport({ addDependencyTo: webpack }), postcssUrl({})];
    },
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: true
        })
    ]
}
