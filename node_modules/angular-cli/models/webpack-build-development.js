"use strict";
var path = require('path');
exports.getWebpackDevConfigPartial = function (projectRoot, appConfig) {
    return {
        devtool: 'source-map',
        output: {
            path: path.resolve(projectRoot, appConfig.outDir),
            filename: '[name].bundle.js',
            sourceMapFilename: '[name].map',
            chunkFilename: '[id].chunk.js'
        }
    };
};
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/models/webpack-build-development.js.map