FROM node:20.16-alpine3.19

RUN mkdir -p /home/app/

WORKDIR /home/app/

COPY . .

RUN npm i pnpm@10.6.4 -g

# RUN rm -f pnpm-lock.yaml

# 清空可能存在的 node_modules 目录和 pnpm 缓存
# RUN rm -rf node_modules && pnpm store prune

# 设置Node.js的内存限制为8GB
ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN pnpm install

RUN pnpm build

EXPOSE 3051

# 设置环境变量，确保服务在 3051 端口启动
ENV PORT=3051
ENV HOST=0.0.0.0

# 使用 node 直接运行构建后的服务器文件
CMD ["node", ".output/server/index.mjs"]
