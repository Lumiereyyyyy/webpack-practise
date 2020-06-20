const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const isDev = process.env.NODE_ENV === "development";
const config = require('./public/config')[isDev ? 'dev' : 'build'];

module.exports = {
    mode:'development',
    entry:["./src/index.js"],
    output:{
        // 输出目录
        path:path.resolve(__dirname,'dist'),
        // 文件名称
        filename:'bundle.[hash].js'
    },
    module:{
        rules:[
            {
                test: /\.jsx?$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env'],
                        plugins:[
                            [
                                "@babel/plugin-transform-runtime",
                                {
                                    "corejs": 3
                                }
                            ]
                        ]
                    }
                },
                exclude:/node_modules/ //排除node_modules目录
            },
            {
                test:/\.(le|c)ss$/,
                /**
                 * 从 右 到 左 执行
                 * style 动态创建style标签，将css插入到head中
                 * css 负责处理@import语句
                 * postcss-loader 和 autoprefixer自动生成浏览器前缀
                 * less 编辑less
                 */
                use:['style-loader','css-loader',{
                    loader:"postcss-loader",
                    options:{
                        plugins: function () {
                            return [
                                require('autoprefixer')({
                                    "overrideBrowserslist": [
                                        ">0.25%",
                                        "not dead"
                                    ]
                                })
                            ]
                        }
                    }
                },'less-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240, //10K  资源大小小于 10K 时，将资源转换为 base64，超过 10K，将图片拷贝到 dist 目录
                            esModule: false,
                            name: "[name]_[hash:6].[ext]"
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        //数组放着所有的plugin插件
        new HTMLWebpackPlugin({
            template:'./public/index.html',
            filename:'index.html',//打包后的文件名
            config: config.template,
            minify:{
                removeAttributeQuotes: false, //是否删除属性双引号
                collapseWhitespace:false //是否折叠
            }
            // hash: true //是否加上hash 默认false
        }),
        new CleanWebpackPlugin(),
    ],
    devServer:{
        port: 1234,
        quiet:false,//若开启则除了开始的启动信息外的其他信息都不再展示在控制台
        inline:true,//默认开始inline模式，否则位iframe模式
        stats:'errors-only' ,//终端仅打印error
        overlay:false,//默认不启用 是否在浏览器窗口全屏输出错误
        clientLogLevel:"silent",//日志等级
        compress:true //是否启用gzip压缩
    },
    devtool:'cheap-module-eval-source-map' //开发环境下使用 将编译后的代码映射回原始源代码
}