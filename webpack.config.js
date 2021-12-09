const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

module.exports = {
    mode: process.env.NODE_ENV || "development",
    devtool: 'eval-source-map',
    entry: {
        scss: path.join(__dirname, './src/scss/core.scss'),
        background: path.join(__dirname, './src/ts/background.ts'),
        content_script: path.join(__dirname, './src/ts/content_script.ts')
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: './js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: 'text-loader',
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
            filename: './css/core.css',
        }),
        new CopyPlugin([{
            from: './public',
            to: '.'
        }])
    ]
}