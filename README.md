
# Microservice Shop Store
This repository contains the source code for a microservice-based shop store application. The application is built using multiple services, including the Product Service, Shopping Service, and Customer Service. These services work together to provide various functionalities for the shop store.

# Prerequisites
Before running the application, ensure that you have the following dependencies installed:

• Docker<br>
• Node.js (v18 or higher)<br>
• npm (Node Package Manager)<br>

# Installation
To install the necessary dependencies for the shop store application, follow these steps:

Clone the repository:

git clone https://github.com/zivoradt/NodeJS-microservices.git
cd microservice-shop-store<br>

Install dependencies for each service:

Each service (Product Service, Shopping Service, and Customer Service) has its own Dockerfile and .env file. Navigate to each service's directory (products, shopping, customer) and run the following command to install the dependencies:

• npm install<br>
This command will read the package.json file and download all the necessary packages and libraries into a node_modules directory within each service.

# Usage
To start the microservice shop store application, follow these steps:

Start the NoSQL database (MongoDB):

Run the following command to start the MongoDB container:

• docker-compose up -d nosql-db<br>

Start the services:

Run the following command to start the services (Product Service, Shopping Service, and Customer Service):

• docker-compose up -d products shopping customer<br>

Each service will be built and started in separate Docker containers.

Start the NGINX proxy:

Run the following command to start the NGINX proxy container:

• docker-compose up -d nginx-proxy<br>
The NGINX proxy will handle the routing to the appropriate services based on the specified paths.

Access the application:

Once the containers are up and running, you can access the microservice shop store application using the appropriate endpoints. The NGINX proxy is configured to route requests to the correct services based on the following paths:

/ -> Product Service<br>
• /shopping -> Shopping Service<br>
• /customer -> Customer Service<br>
