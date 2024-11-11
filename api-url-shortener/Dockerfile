FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --cache /tmp/empty-npm-cache

COPY . .

# Necessário para configurar o prisma para o Sistema no qual a aplicação roda
RUN npx prisma generate


# O Docker foi pensado para produção, então para deploy é necessário atualizar o build
RUN npm run build

EXPOSE 3002

# Tenta fazer as migrations no banco e start
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]