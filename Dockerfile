# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of the app and build
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy only package.json and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy the build files from the build stage
COPY --from=build /app/dist ./dist

# Copy the .env file from the local context to the container
COPY .env .env

# make uploads file 
RUN mkdir -p /app/uploads

EXPOSE 5000

CMD ["node", "dist/server.js"]
