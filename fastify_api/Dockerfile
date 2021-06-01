# select node version
FROM node:14.17.0

# set the work directory
WORKDIR /app

COPY . /app

RUN npm install

# script start in dev mode
CMD ["npm","run","dev"]