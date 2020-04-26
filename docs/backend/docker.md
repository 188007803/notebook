# 01_初识Docker


## Docker 是什么
- 一次封装，到处执行
- 基于Linux的高效、敏捷、轻量级容器方案。

## 使用
```sh
# 下载镜像
git clone ...../docker_ci.git

# 启动镜像（所有的服务都启动了）
docker-compose up

```

# 02_Docker安装


[腾讯云 ubuntu 系统改为 root 登陆](https://cloud.tencent.com/developer/article/1405735)

```shell
# apt升级
sudo apt-get update

# 添加相关软件包
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

# 下载软件包的合法性，需要添加软件源的 GPG 密钥
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -


# source.list 中添加 Docker 软件源
sudo add-apt-repository \
 "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu \
 $(lsb_release -cs) \
 stable"

# 安装 Docker CE
sudo apt-get update
sudo apt-get install docker-ce

# 脚本自动安装（不需要）
curl -fsSL get.docker.com -o get-docker.sh
sudo sh get-docker.sh --mirror Aliyun

# 启动 Docker CE
sudo systemctl enable docker
sudo systemctl start docker

# 建立 docker 用户组（附加）
sudo groupadd docker
sudo usermod -aG docker $USER

# Helloworld
docker run hello-world

```

[启动Docker CE时如果报这个错：perl: warning: Setting locale failed. 的解决方案](https://www.jianshu.com/p/7cb39acb2513)



镜像加速

- [Azure中国镜像 https://dockerhub.azk8s.cn](https://github.com/Azure/container-service-for-azure-china/blob/master/aks/README.md#22-container-registry-proxy)
- [阿里云加速器(需登录帐号获取)](https://cr.console.aliyun.com/cn-hangzhou/mirrors)
- [七牛云加速器 https://reg-mirror.qiniu.com](https://kirk-enterprise.github.io/hub-docs/#/user-guide/mirror)



```shell
# /etc/docker/daemon.json

{
	"registry-mirrors": [
		"https://dockerhub.azk8s.cn",
		"https://reg-mirror.qiniu.com"
	]
}

# 重启docker服务
sudo systemctl daemon-reload
sudo systemctl restart docker

# 测试一下下载速度
docker pull nginx


```


# 03_简单Nginx服务


```sh
# 拉取nginx镜像
docker pull nginx

# 查看
docker images nginx

# www目录里放一个index.html
mkdir www
echo 'hello docker!!' >> www/index.html

# 用 docker 启动 nginx 镜像
# 参数： 端口映射：-p 8000:80， 目录映射 -v ....
docker run -p 8000:80 -v $PWD/www:usr/share/nginx/html nginx

# 用 docker 启动 nginx 镜像
# 参数： 端口映射：-p 8000:80， 目录映射 -v ....， 守护模式 -d
docker run -p 8000:80 -v $PWD/www:usr/share/nginx/html -d nginx

# 查看docker进程
docker ps

# 查看所有docker进程
docker ps -a

# 停镜像
docker stop [container ID 前3位]

# 启动镜像
docker start [container ID 前3位]


# 进入docker内部的伪终端
docker exec -it [c99] /bin/bash

# 看看刚才映射的目录
cd /usr/share/nginx/html
cat index.html

# 退出docker内部
exit

# 停止并删除列表中的镜像（不是删除镜像本身）
docker stop c99
docker rm c99

```

# 04_Docker运行过程

- 镜像 (Image)
  面向Docker的只读模板

- 容器 (Container)
  镜像的运行实例

- 仓库 (Registry)
  存储镜像的服务器

- 流程图

  ![image-20200315230508715](/Users/liushuang/Library/Application Support/typora-user-images/image-20200315230508715.png)

# 05_定制镜像

>  镜像的定制实际就是定制每一层所添加的配置、文件。如果我们可以把每一层修改、安装、构建、操作的命令都写入一个脚本，用这个脚本来构建、定制镜像，那么之前提及的无法重复的问题、镜像构建透明性的问题、体积的问题就都会解决。这个脚本就是Dockerfile。



- 定制自己的web服务器

  ```shell
  # 创建Dockerfile
  FROM nginx:latest
  RUN echo '<h1>Hello, Kaikeba!</h1>' > /usr/share/nginx/html/index.html
  ```

  ```shell
  # 进入Dockfile所在目录,如:
  cd ~/source/docker/nginx

  # 定制镜像
  docker build -t nginx:kaikeba .

  # 运行
  docker run -p 8000:80 nginx:kaikeba
  ```


# 06_定制NodeJS镜像

## 准备好node和npm

```shell
# 安装nvm
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

# 查看可安装node版本
nvm ls-remote

# 安装node和npm(最新lts版)
nvm install --lts

# 升级npm
npm i -g npm

# npm换源
npm config set registry https://registry.npm.taobao.org

# npm源还原
npm config set registry https://registry.npmjs.org

```



## 开发一个简单koa程序

```shell
npm init -y
npm i koa -s
vi app.js
```

```javascript
// app.js
const Koa = require('koa')
const app = new Koa()
app.use(ctx => {
  ctx.body = 'Hello NodeJS !!'
})
app.listen(3000, () => {
  console.log('app started at 3000')
})
```



写入Dockerfile

```dockerfile
FROM node:12-alpine
ADD . /app/
WORKDIR /app
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]
```



构建镜像

```shell
# 定制镜像
docker build -t mynode .

# 启动镜像
docker run -p 3000:3000 mynode
```


# 07_PM2镜像

```sh
# 拷贝一下上节课的node镜像

cp -R node pm2
cd pm2
```



```sh
# .dockerignore
node_modules
```

```yaml
// proces.yml
apps:
  - script: app.js
    instances: 2
    watch: true
    env:
      NODE_ENV: production
```

```dockerfile
# Dockerfile

FROM keymetrics/pm2:latest-alpine
WORKDIR /usr/src/app
ADD . /usr/src/app
RUN npm config set registry https://registry.npm.taobao.org/ && npm i
EXPOSE 3000

# pm2 在 docker 中的命令为 pm2-docker
CMD ["pm2-runtime", "start", "process.yml"]
```



```sh
# 定制镜像
docker build -t mypm2 .

# 启动镜像
docker run -p 3000:3000 -d mypm2
```

# 08_Docker-compose

```sh
# 安装 docker-compose
apt install docker-compose

# 新建 docker-compose
mkdir helloworld && cd helloworld
vi docker-compose.yml

```


```yml
# docker-compose.yml

version: '3.1'
services:
  hello-world:
    image: hello-world
```



```sh
# 启动 docker-compose
docker-compose up
```



compose是官方开源项目，负责docker容器集群的快速编排

```yaml
# docker-compose.yml 
# 一次性启动 mongo 和 mongo-express 镜像

version: '3.1'
services:
  mongo:
    image: mongo
    restart: always
    ports:
      - 27017:27017
  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - 8000:8081
      
```



```
docker-compose up
```

# 09_前后端分离

```sh
# 免密登录

# 查看我的本机公钥（ 还有对应的私钥 id_rsa ）
cat ~/.ssh/id_rsa.pub

# 如果没有就生成一对（一路回车即可）
ssh-keygen -t rsa     [-C "yourEmail"]

# 把公钥复制到远程主机上（出来一些提示，并要你输入密码后，就成功了。）
ssh-copy-id -i ~/.ssh/id_rsa.pub root@你的IP地址

# 登录
ssh root@你的IP地址

# 给服务器起别名

cd ~/.ssh
touch config
vi config

# config
Host *
  UseKeychain yes
Host server1
  HostName 148.157.254.111
  User root
  
Host server2
  HostName 148.157.254.112
  User root

# 用别名登录
ssh server1

# 注意：nodejs的ssh2模块 不能解析 ssh 生成的密钥
# 如果用vscode的deploy插件时报这个错：Cannot parse privateKey: Unsupported key format
# 你需要将公钥转换格式，或重新生成密钥对

# 重新生成
ssh-keygen -m PEM -t rsa 

# 转换已有的私钥格式 (推荐，注意先备份)
ssh-keygen -p -m PEM -f ~/.ssh/id_rsa


```



```sh
# 典型的前后分端项目
# 包括4个容器 (app-pm2, mongo, mongo-express, nginx)
# 其中app-pm2需要自己构建
# 其余的直接拉镜像

```



```dockerfile
# docker-compose.yml

version: '3.1'
services:
  app-pm2:
      container_name: app-pm2
      #构建容器
      build: ./backend
      #直接从git拉去
      # build: git@github.com:su37josephxia/docker_ci.git#:backend
      # 需要链接本地代码时
      # volumes:
      #   - ./backend:/usr/src/app
      ports:
        - "3000:3000"
  mongo:
    image: mongo
    restart: always
    ports:
      - 27017:27017
  mongo-express:
    image: mongo-express
    restart: always 
    ports:
      - 8081:8081
  nginx:
    restart: always
    image: nginx
    ports:
      - 8091:80
    volumes:
      - ./nginx/conf.d/:/etc/nginx/conf.d
      - ./frontend/dist:/var/www/html/
      - ./static/:/static/
```



# 10_持续集成

git重要技能

```shell
# git push 强制提交
git push -f origin master 

# 从远程仓库下载最新版本
git fetch --all 
# 将本地设为刚获取的最新的内容(强制覆盖)
git reset --hard origin/master

```

利用webhooks 来持续构建

```javascript
// webhooks.js
// github的webhooks 中要有同样的配置 ( path: '/webhook', secret: 'myhashsecret')

var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/webhook', secret: 'myhashsecret' })

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)

handler.on('*', function (event) {
    console.log('Received *', event.payload.action);
})

handler.on('error', function (err) {
  console.error('Error:', err.message)
})

handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)

    // 分支判断
    if(event.payload.ref === 'refs/heads/master'){
        console.log('deploy master..')
        run_cmd('sh', ['./deploy-dev.sh'], function(text){ console.log(text) });
    }
})

handler.on('issues', function (event) {
  console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})



function run_cmd(cmd, args, callback) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString(); });
    child.stdout.on('end', function () { callback(resp) });
}


```



持续构建的布署脚本

```shell
#deploy-dev.sh

echo Deploy Project
# docker-compose up -d --force-recreate --build

# 获取最新版代码
git pull

# 强制重新编译容器
docker-compose down
docker-compose up -d --force-recreate --build


# 定制镜像
# docker build -t myapp:pm2 ./backend

# 重启启动容器
# docker stop myapp
# docker rm myapp
# docker run --name myapp -p 3000:3000  -d myapp:pm2
```



实际经验

```
- 改前端dist目录，改动可以立即生效，因为不需要构建。

- 改后端server的内容，却不会立即生效，因为没有引发构建，只有改改docker-compose, 才会引发重新构建

```



### ubuntu 安装 nginx

```shell
# 安装nginx
$sudo apt-get install nginx

# 更新源
$sudo apt-get update

# 更新已安装的包
$sudo apt-get upgrade

$sudo /etc/init.d/nginx start # 启动
$sudo /etc/init.d/nginx stop  # 停止
$sudo /etc/init.d/nginx restart # 重启
$sudo /etc/init.d/nginx status # 状态

# 查看端口占用
lsof -i:80 

# 测试nginx.conf文件
/usr/sbin/nginx -t -c /etc/nginx/nginx.conf



```

| 名称             | 目录                  |
| ---------------- | --------------------- |
| 配置文件         | /etc/nginx/nginx.conf |
| 程序文件         | /usr/sbin/nginx       |
| 日志             | /varlog/nginx         |
| 默认虚拟主机     | /var/www/html         |
| 守护进程程序文件 | /etc/init.d/nginx     |

