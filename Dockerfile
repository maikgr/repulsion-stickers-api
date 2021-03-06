FROM node:latest

# Create the directory
RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

# Copy and Install api package
COPY package.json /usr/src/api
RUN npm install

# Copy source files
COPY . /usr/src/api

# Start the api
CMD ["node", "api.js"]