FROM nginx:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Create directory for SQLite database if it doesn't exist
RUN mkdir -p /app/data
# Set permissions for the data directory
RUN chmod 777 /app/data
EXPOSE 5000
# Add environment variables
ENV PORT=5000
ENV DATABASE_URL="file:/app/data/database.sqlite"
CMD ["npm", "start"]