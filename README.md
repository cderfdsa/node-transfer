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
|---node-transfer
|	|
|	|---src			# 开发目录
|	|   |
|	|   |---config 配置文件
|	|   |	|
|	|   |	└── menu   #widget模板组件
|	|   |
|	|   |---config 配置文件
|	|
|	|---dist		# 产出目录
|	|
|	|---node_modules	# npm 包依赖
|	|
|	|---buildDocker.sh	# Docker
|	|
|	|---Dockerfile		# Docker
|	|
|	|---gulpfile.js		# gulp 配置文件
|	|
|	|---package.json	# npm 包配置
|	|
|	|---README.md		# 入口文档
|	|
|	|---.gitigore		# git 忽略文件列表
		......
```
