FROM node:17.9.0

WORKDIR /app

COPY . .

RUN cd server && npm install
RUN cd server && yarn install

RUN cd demo && npm install
RUN cd demo && yarn install

CMD "/bin/bash"

