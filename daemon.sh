#!/usr/bin/env bash

cd -P "$( dirname ${BASH_SOURCE[0]} )"

pkill -9 node
pkill -9 python
pkill -9 chrome
pkill -9 Xvnc

sleep 3

yarn build &
yarn start &
