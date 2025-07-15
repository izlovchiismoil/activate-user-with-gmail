# Node.js image
FROM node:22

# App papkasi
WORKDIR /usr/src/app

# Fayllarni ko‘chirish
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001
CMD ["npm", "start"]
