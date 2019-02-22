const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: ['./src/index'],
    target: 'node',
    node: {
        __filename: true,
        __dirname: true
    },
    output: {
        path: path.resolve(__dirname, "./build"),
        filename: 'server.js',
        publicPath: '/'
    },
    externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000']})],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [
                    { loader: 'babel-loader' }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
        })
    ],
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src'),
            '@routes': path.resolve(__dirname, 'src/routes'),
            '@models': path.resolve(__dirname, 'src/models'),
            '@controllers': path.resolve(__dirname, 'src/controllers'),
            '@fixtures': path.resolve(__dirname, 'src/__test__/fixtures')
        }
    }
}