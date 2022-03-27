import CopyPlugin from 'copy-webpack-plugin';

const copyTdlibFiles = new CopyPlugin({
    patterns: [
        {
            from: 'node_modules/tdweb/dist/*',
            to({ context, absoluteFilename }) {
                return '[name][ext]';
            },
            globOptions: {
                ignore: ['tdweb.js'],
            }
        }
    ],
});

module.exports = {
    webpack: {
        plugins: [
            copyTdlibFiles,
        ],
    },
};