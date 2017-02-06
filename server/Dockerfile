FROM node:6.2.2-slim
RUN mkdir -p /usr/local/auth
ADD package.json /tmp/package.json
WORKDIR /usr/local/auth
COPY . /usr/local/auth
RUN npm install
EXPOSE 8080
CMD [ "node", "server/app.js" ]
