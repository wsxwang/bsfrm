const path = require('path');


module.exports = {
    entry: {
        // 模块：desktop
        desktop: './src/desktop/app.js',
        // 模块：login
        login: './src/login/app.js',
        admin: './src/admin/app.js',
    },
    output: {
        // 输出文件名：模块名.dst.js
        filename: '[name].dst.js',
        // 输出路径：当前路径下的dst目录
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
                    // 目标路径是/ttfs，生成文件时会在dst目录下建立ttfs目录，将文件拷贝至后端public/ttfs目录下即可
                    name: '/ttfs/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    // 目标路径是/images，生成文件时会在dst目录下建立images目录，将文件拷贝至后端public/images目录下即可
                    name: '/images/[name].[ext]?[hash]'
                }
            }
        ]
    }
};