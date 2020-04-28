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
# 先把源设为官方源
# 可靠先安装nrm，方便进行源切换
npm i -g nrm 
nrm ls
nrm use npm

npm adduser # 按照提示，分别输入用户名，密码，邮箱，并到邮箱里去进行确认


```



## 发布包

```sh
npm login # 登录，依次输入用户名，密码，邮箱，

npm publish # 发布包
# tip1：发布至少要有 index.js  package.json  README.md 三个文件
# tip2：不能发布其他用户发布的包，名称必须唯一。
# tip3：每次发布，版本号都必须要变

npm unpublish xxx --force # 删除上传的包
# tip1: 根据规范，只有在发包的24小时内才允许撤销发布
# tip2：对于测试包，不要污染网站，测试成功后就删除。


```

