FROM node

WORKDIR /app/customer

COPY package.json .

RUN npm install 


COPY . /src/

EXPOSE 8001


CMD ["npm", "start"]

