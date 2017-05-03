FROM daocloud.io/node:4.4.7
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV NODE_EVN=development

COPY package.json /usr/src/app/
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install -g gulp
RUN cnpm install
COPY . /usr/src/app
RUN gulp release

VOLUME /usr/src/app/dist/public/dist
CMD [ "npm", "start" ]

EXPOSE 3000
