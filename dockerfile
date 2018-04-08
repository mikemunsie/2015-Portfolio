from node:9-slim

ENV PORT=9001

ADD . /usr/app

WORKDIR '/usr/app'
RUN yarn
RUN npm run build

EXPOSE 9001
CMD [ "npm", "start" ]