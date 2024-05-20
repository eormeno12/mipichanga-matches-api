# Dockerfile
FROM node:18-alpine
# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the Next.js application for production
RUN npm run build
# Set the environment variable to run the Next.js application in production mode
ENV MONGO_DB=matches_api
ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=root
ENV MONGO_PORT=27017
ENV MONGO_HOST=107.23.30.220
ENV MONGO_CONNECTION=mongodb

ENV JWT_SECRET=64f6982a914f8eba6754376a303cc0ee3129a9b308b71e1a47a2631cbde2539b
ENV JWT_EXPIRES_IN=1d

ENV PORT=3003
ENV FRONTEND_URL='http://localhost'
ENV FRONTEND_DOMAIN=localhost

# Expose the port that the application will run on
EXPOSE 3003

# Start the application
CMD [ "npm", "run", "start:prod" ]
