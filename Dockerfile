FROM node

# create work directory
WORKDIR /user/src/app

# copy both package and package-lock
COPY package*.json ./
COPY tsconfig.json ./
COPY tslint.json ./

# Bundle app source
COPY ./src ./src

# install node dependencies
RUN npm install

# run app on container port 8080
EXPOSE 8080

# actually run the app
CMD ["npm", "run", "start"]

