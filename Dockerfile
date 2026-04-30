FROM dhi.io/node:24-alpine3.22-dev AS build
WORKDIR /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code
COPY . .

# Build the Angular app for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM dhi.io/nginx:1.28.0-alpine3.21-dev

# Copy built application from build stage
COPY --from=build /app/dist/java-front-end/browser /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8082
EXPOSE 8082
CMD ["nginx", "-g", "daemon off;"]