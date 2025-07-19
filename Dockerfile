FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create production environment
ENV NODE_ENV=production
ENV PORT=5001

# Expose port
EXPOSE 5001

# Start the application
CMD ["npm", "start"] 