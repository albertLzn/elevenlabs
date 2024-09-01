# Use the official Node.js image from the Docker Hub
FROM node:20

# Install MySQL client
RUN apt-get update && apt-get install -y default-mysql-client

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install Node.js dependencies specified in package.json
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Ensure the entrypoint script has Unix line endings and execute permissions
RUN apt-get update && apt-get install -y dos2unix
RUN dos2unix /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Use the entrypoint script to check for DB readiness and run the migrations and seeds
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]

# Command to run the app
CMD ["npm", "run", "dev"]
