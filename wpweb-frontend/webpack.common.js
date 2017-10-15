const path = require('path');


module.exports = {
    entry: {
		home: './src/app.js',
        debug: './src/debug.js',
    },
    output: {
        filename: '[name].dst.js',
        path: path.resolve(__dirname, 'dst')
    },
    module: {
        rules: [
            {
                // vue-loader，处理vue文件
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                // vue-loader默认使用babel-loader处理js
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: path.join(__dirname, './node_modules')
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: '/ttfs/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: '/images/[name].[ext]?[hash]'
                }
            }
        ]
    }
};