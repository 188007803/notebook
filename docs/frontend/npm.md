# npm 



## 常用命令

```sh
npm login #登陆

npm whoami #查看当前使用的用户

npm update xxx #更新模块

npm publish  #上传包

npm unpublish xxx --force  #删除远程包

npm install rimraf -g # 安装删除工具

rimraf node_modules  #删除本地文件夹

npm list -g --depth 0  #查看本地全局安装过的包

npm uninstall -g xxx   #卸载本地全局安装包

npm outdated #检查依赖的最新版本

```



## 注册和登录

```sh
npm i -g nrm # 先安装nrm，方便进行源切换
nrm ls # 查看所有源
nrm use npm # 把源设为官方源

npm adduser # 按照提示，分别输入用户名，密码，邮箱，并到邮箱里去进行确认


```



## 发布包

```sh
npm login # 登录，依次输入用户名，密码，邮箱，

npm publish # 发布包
# tip1：发布至少要有 index.js  package.json  README.md 三个文件
# tip2：不能发布其他用户发布的包，名称必须唯一。
# tip3：每次发布，版本号都必须要变
# tip4：重新发布至少要过24小时，就是说测试的时候，如果删除了再次发布，就得换个名字
# tip5：package.private：是否私有，需要修改为 false 才能发布到 npm

npm unpublish xxx --force # 删除上传的包
# tip1: 根据规范，只有在发包的24小时内才允许撤销发布
# tip2：对于测试包，不要污染网站，测试成功后就删除。


```

## 一键更新所有信赖包
```sh
# 用 npm-check
npm-check -u  #更新当前项目依赖
npm-check -gu #更新全局信赖


# 用 yarn
yarn upgrade-interactive --latest

```

## 快速发布 Vue 组件

### 使用 vue-cli4 发布
```sh

参考：https://www.jianshu.com/p/b4568343cc7f

# 安装 vue-cli
npm install -g @vue/cli
# OR
yarn global add @vue/cli

# 搭建脚手架 
vue create my-vue-comp
# OR
vue ui

# 把组件放在 src/packages下, 按规范这样写

├── src/                           // 源码目录
│   ├── packages/                  // 组件目录
│   │   ├── banner/                // 组件
│   │   │   ├── banner.vue         // 组件代码
│   │   │   ├── index.js           // 组件入口

```

```javascript
// 组件入口 index.js
import Banner from './banner';
Banner.install = Vue => Vue.component(Banner.name, Banner);
export default Banner;
```


```javascript
// 在 main.js 建一个 index.js 引入全部组件

import Banner from './packages/banner/index.js';
// ...如果还有的话继续添加

const components = [
  Banner
  // ...如果还有的话继续添加
]

const install = function(Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component);
  })
}

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Banner
  // ...如果还有的话继续添加
}

```

```js
 // main.js 里这样引入，如果是在浏览器上，会自动注册
 import All from './index'
 Vue.use(All)
```



### 使用vue-sfc-cli发布
```sh
# 使用 vue-sfc-cli
# 文档: https://github.com/FEMessage/vue-sfc-cli/blob/dev/README-zh.md

npx vue-sfc-cli

cd my-component
git init
yarn
yarn dev
yarn build
yarn publish
```



