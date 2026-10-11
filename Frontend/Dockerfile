# Node.js 24 on Alpine, following the September 7 lesson.
FROM node:24-alpine

# Create the application folder inside the image.
WORKDIR /app

# Install dependencies before copying the application.
COPY package*.json /app/
RUN npm install

# Copy the application; .dockerignore excludes secrets and node_modules.
COPY . /app

# Run the existing start script.
ENTRYPOINT ["npm", "start"]
