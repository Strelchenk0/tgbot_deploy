    // PROJECT OVERVIEW  //
This project is focused on creating and deploying a simple Telegram bot that tracks Bitcoin prices. The bot provides basic statistical data about Bitcoin's price over different periods of time. It was developed to automate the process of gathering and displaying price data using Docker containers and infrastructure as code tools like Terraform and Ansible.

    //   DEVELOPMENT //
The core functionality of the project is a Telegram bot. This bot:
 - Tracks Bitcoin prices in real-time.
 - Provides basic statistics for specified time intervals (e.g., hourly, daily, weekly).
 - Uses an external API or a data source to fetch and analyze the Bitcoin price trends.

   //   DEVELOPMENT PROCESS   //
    1. Terraform (Infrastructure as Code)
    Terraform is used to automate the provisioning of cloud infrastructure, specifically on AWS:
        1. Instance creation: Terraform is configured to create an EC2 instance with an Elastic IP and a security group for the bot.
        2. Key-based authentication: Terraform uses the key.pub file to ensure secure access to the instance.
        3. The process of creating and managing infrastructure is done through Terraform configurations and can be applied or destroyed as needed.

    2. Ansible (Configuration Management)
    Ansible is used to configure the EC2 instance once it has been provisioned:
        1. Connection to EC2: Ansible connects to the EC2 instance via SSH using the public key created by Terraform.
        1. Environment setup: Ansible prepares the environment by installing necessary dependencies (e.g., Docker).
        3. Docker image management: Ansible pulls the Docker image that contains the Telegram bot code and runs it inside a container on the instance.

    3. GitLab CI/CD Pipeline (Continuous Integration and Deployment)
    A GitLab CI pipeline has been created to automate the full deployment workflow, from building the Docker image to managing infrastructure. The pipeline includes the following stages:

        1. Build Docker Image:
        The bot's code is packaged into a Docker image, ensuring it runs in a consistent environment.

        2. Terraform Plan:
        Terraform is used to create a plan for provisioning infrastructure. This stage prepares the resources needed to run the bot.

        3. Terraform Apply:
        Terraform applies the infrastructure plan, provisioning the necessary AWS resources (EC2 instance, security groups, etc.).

        4. Run Ansible:
        Ansible is triggered to connect to the provisioned instance and perform the necessary setup and container deployment.

        5. Terraform Destroy:
        Once the bot has completed its task or if the infrastructure is no longer needed, Terraform is used to destroy the infrastructure, releasing all resources (such as the EC2 instance and Elastic IP).

        FEATURE:
     ///   Dynamic Elastic IP Management: The pipeline dynamically saves the Elastic IP created by Terraform and passes it as an artifact to Ansible, ensuring the bot is deployed to the correct server.  ///


USED TEHNOLOGIES:
- NodeJS
- Terraform  
- Ansible
- Docker
- Git  
- GitLab CI/CD  
- AWS (EC2, AMI)  
