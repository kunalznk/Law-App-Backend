FROM node:alpine

WORKDIR /server

COPY ./package.json .

COPY ./tsconfig.json .

COPY ./jest.config.js .

COPY ./babel.config.js .

RUN npm install

RUN npm run test

RUN npm run build

CMD ["npm" , "run" , "start"]