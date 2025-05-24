# Use a compatible Node.js version for Next.js
FROM --platform=linux/amd64 node:18-alpine
# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 