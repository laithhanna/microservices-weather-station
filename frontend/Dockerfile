# Use a node base image to build the React application
FROM node:17.4.0 as build
# Set the working directory in the container
WORKDIR /app
# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the source code
COPY . .
# Build the static files
RUN npm run build

# Use an nginx base image to serve the static files
FROM nginx:stable-alpine
# Copy the static files from the build stage into the nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
