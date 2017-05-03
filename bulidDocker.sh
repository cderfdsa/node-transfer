#!/bin/bash
port=$1
path=$2

docker build -t mwweb .
docker stop mwweb
docker rm -f mwweb
docker run --name mwweb -p ${port}:3000 -v ${path}:/usr/src/app/dist/public/dist -d mwweb
