FROM node:8-alpine
LABEL Author="hxn <1621337716@qq.com>"

ADD ./ /vaper

# frontend
WORKDIR /vaper/server-frontend
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm run build:prod
RUN cp -r /vaper/server-frontend/dist /vaper/server-backend/public

# backend
WORKDIR /vaper/server-backend
RUN npm install -g pm2 --registry=https://registry.npm.taobao.org
RUN npm install --registry=https://registry.npm.taobao.org

ENTRYPOINT pm2-runtime start bin/run -i 1