# Use Node.js base image for building the application
FROM node:18-alpine AS build
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY . .
# Build the Next.js application
RUN npm run build
# Use Nginx to serve the built application
FROM nginx:alpine
# Copy the built application to Nginx's HTML directory
COPY --from=build /app/.next /usr/share/nginx/html
# Expose the frontend port
EXPOSE 3000
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]