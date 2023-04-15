# Use an official Node.js runtime as a parent image
FROM node:19
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package.json .
COPY package-lock.json .

RUN npm install
COPY . .
RUN npm run build

# Expose port 3000 for the app to listen on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]