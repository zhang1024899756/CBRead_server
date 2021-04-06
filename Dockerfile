# build stage 构建阶段
# 基于node
FROM node:lts-alpine
# 将工作区设为 /app，和其他系统文件隔离
RUN rm -rf /app
RUN mkdir /app
WORKDIR /app
# 拷贝 package.json/package-lock.json 到容器的 /app 目录
COPY package*.json ./
# 拷贝其他文件到容器 /app 目录，分两次拷贝是因为保持 node_modules 一致
COPY . .
# 在容器中安装依赖
RUN npm install pm2 -g \
    && npm install
# 使用pm2管理
CMD ["pm2-runtime", "start", "/app/app.js"]
# 容器对外暴露 8000 端口
EXPOSE 8000