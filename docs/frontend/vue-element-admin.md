# VueElementAdmin 修改

VueElementAdmin 是一个优秀的后台框架，但是用到自己系统中，还是需要定制和修改一番，以下是常用的修改记录：

## 下载并升级

```sh
# 下载最新版
git clone https://github.com/PanJiaChen/vue-element-admin.git

# 升级所有安装包
# 打开 package.json, 将所有依赖版本都升至最新

# 特殊升级如下
# package.json
"devDependencies": {
    + "taskfile": "^0.10.0", // 原runjs的新版本 改名为 taskfile
    - "node-sass": "", // 经常被墙，用sass包替换
    + "sass": "^1.26.0" // sass 的dart版本，更快更好
}

```


## 特殊升级导致的源码相应变更

```javascript
// 某些升了级的包用法要修改

// path-to-regexp 升级后
import pathToRegexp from 'path-to-regexp' // 旧
import { pathToRegexp } from 'path-to-regexp' // 新

// runjs 升级后为 taskfile 后
const { run } = require('runjs') // 旧
const { sh: run } = require('tasksfile') // 新

// node-sass包 改成 sass包后
// 1 在 src 文件夹中 搜索 /deep/
// 2 全部替换为空，注意有时 /deep/ 占一行，要改一改，以免报错

```



## 优化

```javascript
// 修改配置文件 vue.config.js

// 添加包
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// 修改配置
configureWebpack: {
  /// 添加以下配置
  plugins: [
    new BundleAnalyzerPlugin({ analyzerPort: 8919 })
  ],
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    'window': 'window',
    'element-ui': "ELEMENT",
  },
}

config.optimization.splitChunks({
  // 去掉以下配置
  elementUI: {...}
})

```

```html
    <!-- 在 public/index.html 添加CDN -->
    <% if (webpackConfig.mode == 'development') { %>
        <script src="https://cdn.bootcss.com/vue/2.6.11/vue.js"></script>
        <script src="https://cdn.bootcss.com/vue-router/3.1.3/vue-router.js"></script>
        <script src="https://cdn.bootcss.com/vuex/3.1.3/vuex.js"></script>
    <% } else { %>
        <script src="https://cdn.bootcss.com/vue/2.6.11/vue.min.js"></script>
        <script src="https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js"></script>
        <script src="https://cdn.bootcss.com/vuex/3.1.3/vuex.min.js"></script>
    <% } %>
    <script src="https://cdn.bootcss.com/element-ui/2.13.0/index.js"></script>

```



## 精简

```
// 去掉husky, ESLint, README其他语言
// 编辑 .editorconfig

    - indent_size = 2
    + indent_size = 4

```

