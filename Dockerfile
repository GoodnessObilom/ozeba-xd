FROM node:lts-buster

# Clone the correct repository
RUN git clone https://github.com/GoodnessObilom/ozeba-xd.git /root/ozeba-xd

# Set working directory
WORKDIR /root/ozeba-xd

# Install dependencies
RUN npm install && npm install -g pm2 || yarn install --network-concurrency 1

# Copy your local files into the container
COPY . .

# Expose the app port
EXPOSE 9090

# Start the app
CMD ["npm", "start"]
