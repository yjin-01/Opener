#!/bin/sh
REPOSITORY=/home/ubuntu/nest-app

cd $REPOSITORY


sudo pm2 /dist/src/main --name illo


