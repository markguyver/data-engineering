FROM node:alpine
WORKDIR /var/node
COPY application /var/node
RUN npm install --production
CMD ["npm", "start"]
