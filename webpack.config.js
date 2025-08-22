const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/client/js/main.js',
        navigation: './src/client/js/ui/navigation.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/js'),
        clean: false, // Don't clean the entire directory to preserve other files
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js'],
        fallback: {
            // Ignore Monaco editor modules for now since they use AMD loading
            'vs/editor/editor.main': false
        }
    },
    externals: {
        // Treat Monaco as external since it's loaded via CDN
        'monaco-editor': 'monaco'
    },
    devtool: 'source-map', // Generate source maps for debugging
    stats: {
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }
};