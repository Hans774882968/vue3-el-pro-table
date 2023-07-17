[toc]

# vue3-el-pro-table

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## 沉淀自己的pro-table组件，并发布到npm
[传送门](https://github.com/Hans774882968/vue3-el-pro-table)

约定：npm包名`vue3-el-pro-table`，引用`vue3-el-pro-table`的包名为“本项目”。

声明：`Vue3ProTable.vue`代码是在[这个项目](https://github.com/huzhushan/vue3-pro-table/tree/master)的基础上进行修改的。

**作者：[hans774882968](https://blog.csdn.net/hans774882968)以及[hans774882968](https://juejin.cn/user/1464964842528888)以及[hans774882968](https://www.52pojie.cn/home.php?mod=space&uid=1906177)**

### Quick Start
```bash
yarn add vue3-el-pro-table
```

`src/main.ts`

```ts
import 'vue3-el-pro-table/dist/vue3-el-pro-table.css';
import Vue3ProTable from 'vue3-el-pro-table';

createApp(App)
  .use(Vue3ProTable)
  .mount('#app');
```

Then use `<vue3-pro-table />` directly in `.vue` file.

Interface:

```ts
import { Vue3ProTableProps } from 'vue3-el-pro-table';
```

### 开发过程笔记
根据[参考链接3](https://5balloons.info/create-publish-you-first-vue-plugin-on-npm-the-right-way/)，实际上我们只需要提供一个符合Vue插件格式的入口`install.js`，和一个Vue组件。但为了满足npm包迭代过程中的预览、测试等需求，我们仍然需要以组件库的标准来开发这个npm包。因此我采用的方案是：先使用`vue-cli`快速创建一个项目，满足组件的预览、测试等需求，在此基础上再新增一个构建流程。

1. 使用`vue-cli`创建一个普通的Vue3 + TS项目。
2. 新增组件`src/components/Vue3ProTable.vue`。
3. 新增Vue插件入口`src/install.js`：

```js
import HelloWorld from './components/HelloWorld.vue';
import Vue3ProTable from './components/Vue3ProTable.vue';

function install(app) {
  if (install.installed) return;
  install.installed = true;

  app.component('test-hello-world', HelloWorld); // 顺便把脚手架生成的组件也注册为全局组件
  app.component('vue3-pro-table', Vue3ProTable);
}

Vue3ProTable.install = install;

export default { install };
```

4. 新增`build-lib`命令并运行`yarn build-lib`：

```json
{
  "scripts": {
    "build": "vue-cli-service build", // 作为对比
    "build-lib": "vue-cli-service build --target lib --name vue3-el-pro-table ./src/install.js" // 参考：https://cli.vuejs.org/guide/build-targets.html#library
  },
}
```

5. 构建成功后修改`package.json`修改下入口：

```json
{
  "main": "dist/vue3-el-pro-table.umd.js",
}
```

在另一个项目（即本项目）预览最新改动：

```bash
yarn add file:../vue3-el-pro-table
```

接下来开始踩坑了。当引入的组件使用slot的时候会报错：

```
Cannot read properties of null (reading 'isCE')
```

根据[参考链接2](https://stackoverflow.com/questions/71063992/when-importing-self-made-vue-3-library-into-vue-3-project-uncaught-typeerror)，原因是本项目和`vue3-el-pro-table`各有一个vue，即使它们版本相同也会引起冲突。虽然参考链接2的提问说给webpack添加vue配置无济于事，但我的项目用这个配置是可以解决问题的。

在本项目的`vue.config.js`禁用symlinks并alias vue：

```js
const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  chainWebpack(config) {
    config.resolve.symlinks(false);
    config.resolve.alias.set('vue', path.resolve('./node_modules/vue'));
  },
  devServer: {
    port: 8090,
  },
  transpileDependencies: true,
});
```

### add TS Support
为了防止本项目报TS错误，我们的npm包`vue3-el-pro-table`需要给出`.d.ts`文件。

`package.json`指定类型定义文件路径：

```json
{
  "types": "dist/global.d.ts"
}
```

`global.d.ts`不应该放在`dist`目录，因此我把它放到了`src/global.d.ts`，并配置`CopyWebpackPlugin`。`vue3-el-pro-table`的`vue.config.js`：

```js
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
```

最理想的情况下`dist/global.d.ts`能在编译时直接生成，但可惜我们参考的`Vue3ProTable.vue`不是一个TS组件，且改造为TS组件的工作量过大，因此`global.d.ts`是手动维护的。

我们期望`dist/global.d.ts`能够给组件提供类型提示。根据[参考链接4](https://juejin.cn/post/7066730414626308103)，需要以下代码：

```ts
declare const CVue3ProTable: import('vue').DefineComponent<......>;
declare const CHelloWorld: import('vue').DefineComponent<{
  msg: StringConstructor;
}, unknown, unknown, object, object, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, object, string, import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, Readonly<import('vue').ExtractPropTypes<{
  msg: StringConstructor;
}>>, object, object>;

declare module 'vue' {
  export interface GlobalComponents {
    Vue3ProTable: typeof CVue3ProTable
    HelloWorld: typeof CHelloWorld
  }
}
```

这里的`CVue3ProTable, CHelloWorld`看上去很复杂，不会是手写的吧？的确不是手写的，可以让`vue-tsc`生成。首先安装`vue-tsc`并新增命令：

```json
{
  "gen-declaration": "vue-tsc -p tsconfig.declaration.json"
}
```

然后新增`tsconfig.declaration.json`：

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "es",
    "declaration": true,
    "emitDeclarationOnly": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "**/__tests__/**", "**/__demos__/**", "**/*.md"]
}
```

最后执行`yarn gen-declaration`，把组件的类型定义复制到`global.d.ts`即可。

## 参考资料
1. 声明式 UI 介绍：https://flutter.cn/docs/get-started/flutter-for/declarative
2. Cannot read properties of null (reading 'isCE')：https://stackoverflow.com/questions/71063992/when-importing-self-made-vue-3-library-into-vue-3-project-uncaught-typeerror
3. 在 NPM 上创建并发布您的第一个 Vue.JS 插件：https://5balloons.info/create-publish-you-first-vue-plugin-on-npm-the-right-way/
4. 全局组件类型声明的最佳实践 (Vue3+TS+Volar)：https://juejin.cn/post/7066730414626308103