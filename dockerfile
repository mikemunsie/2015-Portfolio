from node:9-slim

ENV PORT=9001

ADD package.json /tmp/package.json
RUN cd /tmp && yarn
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app

ADD . /usr/app

WORKDIR '/usr/app'
RUN npm run build

EXPOSE 9001
CMD [ "npm", "start" ]