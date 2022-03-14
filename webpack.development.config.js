const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const webpack = require("webpack");

module.exports = {
    // define entry file and output
    mode: 'development',
    entry: {
        'bwf-templates': './src/index.js',
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js',
        publicPath: 'http://localhost:9002/'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            ignoreOrder: true,
        }),
        new webpack.DefinePlugin({envMode: 'development'}),
        new DependencyExtractionWebpackPlugin({injectPolyfill: true}),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.svg$/i,
				loader: ['@svgr/webpack'],
            },
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: [
                                    './src/assets/css/abstracts'
                                ],
                            },
                            additionalData:
                                '@import "_colors"; ' +
                                '@import "_variables"; ' +
                                '@import "_breakpoints"; ' +
                                '@import "_mixins"; ',
                        },
                    },
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },
        ]
    },
    devServer: {
        disableHostCheck: true,
        port: 9002,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    devtool: 'eval-source-map'
};