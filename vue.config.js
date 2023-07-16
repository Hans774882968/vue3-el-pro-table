const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = defineConfig({
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src', 'global.d.ts'),
            to: path.resolve(__dirname, 'dist'),
          },
        ],
      }),
    ],
  },
  transpileDependencies: true,
});
