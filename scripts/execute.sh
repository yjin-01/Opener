#!/bin/sh
REPOSITORY=/home/ubuntu/nest-app

cd $REPOSITORY


pm2 start /dist/src/main --name illo


