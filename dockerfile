from node:9-slim

ENV PORT=9001

ADD package.json /tmp/package.json
ADD yarn.lock /tmp/yarn.lock
RUN cd /tmp && yarn install
RUN mkdir -p /usr/app && cp -a /tmp/node_modules /usr/app

ADD . /usr/app

WORKDIR '/usr/app'
RUN npm run build

EXPOSE 9001
CMD [ "npm", "start" ]