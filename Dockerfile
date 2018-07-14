FROM node:8-alpine
LABEL Author="hxn <1621337716@qq.com>"

ADD ./ /vaper
WORKDIR /vaper/server-backend

# install modules
RUN pwd
RUN npm install -g pm2 --registry=https://registry.npm.taobao.org
RUN npm install --registry=https://registry.npm.taobao.org

ENTRYPOINT pm2-runtime start bin/run -i 3