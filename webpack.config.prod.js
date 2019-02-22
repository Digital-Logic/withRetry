const merge = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.config.common');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'sourcemap',
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify('production'),
            "process.env.PORT": JSON.stringify('3000')
        })
    ]
});