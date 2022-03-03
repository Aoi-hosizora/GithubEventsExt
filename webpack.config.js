const path = require('path');
const PACKAGE = require('./package.json');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

function p(f) {
    return path.join(__dirname, f);
}

module.exports = {
    mode: process.env.NODE_ENV || "development",
    devtool: 'cheap-module-source-map',
    // devtool: 'inline-module-source-map',
    entry: {
        scss: p('./src/scss/core.scss'),
        background: p('./src/ts/background.ts'),
        content_script: p('./src/content_script.ts'),
    },
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src')
        },
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        path: p('./dist'),
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
            },
        ],
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
            filename: './css/core.css',
        }),
        new CopyPlugin([
            {
                from: p('./src/etc'),
                to: '.',
                transform: (content, absoluteFrom) => {
                    if (absoluteFrom.includes('manifest.json')) {
                        content = content.toString();
                        content = content.replace(/@@title/g, PACKAGE.title);
                        content = content.replace(/@@version/g, PACKAGE.version)
                        content = content.replace(/@@description/g, PACKAGE.description);
                    }
                    return content;
                }
            },
            {
                from: p('./public'),
                to: '.',
            }
        ])
    ]
}