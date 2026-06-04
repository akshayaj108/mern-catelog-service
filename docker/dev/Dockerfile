FROM Node:24

WORKDIR /catelog/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5550

CMD [ "npm", "run", "dev" ]