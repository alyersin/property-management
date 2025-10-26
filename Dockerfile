
# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose app port (if Next.js default port)
EXPOSE 3000

# Build Next.js app
RUN npm run build

# Start Next.js app
CMD ["npm", "start"]


