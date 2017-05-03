# node-transfer

> 开始

- 进入服务器

``` bash
# 拉取仓库
git clone https://github.com/zhanglingrd/node-transfer.git

# 安装 npm 依赖包
cd node-transfer && npm install

# 启动服务（进程守护[ 并命名]）
pm2 start node-transfer/dist/bin/www[ --name node-transfer]

# 配置 nginx 路由转发，默认3000端口
```

> 目录结构

```
|─── node-transfer
|    |
|    |--- src		# 开发目录
|    |    |
|    |    |─── public	# 前端 build 后的代码拷贝到这里
|    |    |
|    |    |─── views	# 前端 html 目录
|    |    |
|    |    |─── routes	# 路由
|    |    |
|    |    |─── ctrl	# 控制器
|    |    |
|    |    |─── modal	# modal
|    |    |
|    |    |─── db	# 数据库服务
|    |    |    |
|    |    |    └── redis.coffee   # redis 服务
|    |    |
|    |    |─── proxy	# api 转发
|    |    |
|    |    |─── config	# 项目配置
|    |    |
|    |    |─── test	# 测试（unit/e2e）
|    |    |
|    |    └─── bin	# node 入口
|    |
|    |─── dist		# 产出目录
|    |
|    |─── node_modules	# npm 包依赖
|    |
|    |─── buildDocker.sh# Docker
|    |
|    |─── Dockerfile	# Docker
|    |
|    |─── gulpfile.js	# gulp 配置文件
|    |
|    |─── package.json	# npm 包配置
|    |
|    |─── README.md	# 入口文档
|    |
|    |─── .gitigore	# git 忽略文件列表
		......
```

> 前端代码产出后，重启服务

restart.sh

```bash
#! /bin/bash
# 前端产出代码同步到 src/public
ln -s /root/project/[feLibraryName]/dist/ /root/project/node-transfer/src/public

export NODE_ENV=development
cd /root/project/node-transfer/
git pull
gulp release

pm2 restart node-transfer
```
