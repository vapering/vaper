FROM node:8-alpine
LABEL Author="hxn <1621337716@qq.com>"

ADD ./ /vaper-server-backend
WORKDIR /vaper-server-backend

# install modules
RUN pwd
RUN npm install -g pm2 
RUN npm install 

ENTRYPOINT pm2-runtime start bin/run