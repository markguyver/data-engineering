FROM node:latest
WORKDIR /var/node
COPY application /var/node
RUN npm install && npm run compile
CMD ["npm", "start"]
