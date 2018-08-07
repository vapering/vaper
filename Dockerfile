FROM node:8-alpine
LABEL Author="hxn <1621337716@qq.com>"

ADD ./ /vaper
# --registry=https://registry.npm.taobao.org
# frontend
WORKDIR /vaper/server-frontend
RUN npm install 
RUN npm run build:prod
RUN cp -r /vaper/server-frontend/dist /vaper/server-backend/public

# backend
WORKDIR /vaper/server-backend
RUN npm install -g pm2 
RUN npm install 

ENTRYPOINT pm2-runtime start bin/run -i 1