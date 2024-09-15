FROM node:17.4.0

# Set the working directory within the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code into the container
COPY . .

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Command to run the application
CMD ["node", "server.js"]