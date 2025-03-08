FROM node:18.20-alpine3.19

RUN mkdir -p /home/app/

WORKDIR /home/app/

RUN npm i pnpm -g

COPY package.json ./

COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3051

ENTRYPOINT ["pnpm"]

CMD ["start-nuxt-service"]
