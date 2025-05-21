# Use a Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Prisma schema (prisma folder) into the image
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the application (compile TypeScript to JavaScript)
RUN npm run build

# Expose the application port
EXPOSE 4000

# Start the application (run the compiled JavaScript file)
CMD ["node", "src/index.js"]