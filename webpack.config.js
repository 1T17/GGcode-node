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
            // Monaco editor modules use AMD loading
            'vs/editor/editor.main': false
        }
    },
    externals: {
        // Treat Monaco as external since it's loaded via CDN
        'monaco-editor': 'monaco',
        // Exclude Node.js native modules
        'ffi-napi': 'commonjs ffi-napi',
        'ref-napi': 'commonjs ref-napi',
        'fs': 'commonjs fs',
        'path': 'commonjs path',
        'os': 'commonjs os',
        'crypto': 'commonjs crypto',
        'stream': 'commonjs stream',
        'buffer': 'commonjs buffer',
        'events': 'commonjs events',
        'util': 'commonjs util',
        'http': 'commonjs http',
        'https': 'commonjs https',
        'url': 'commonjs url',
        'querystring': 'commonjs querystring',
        'zlib': 'commonjs zlib',
        'net': 'commonjs net',
        'tls': 'commonjs tls',
        'dgram': 'commonjs dgram'
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