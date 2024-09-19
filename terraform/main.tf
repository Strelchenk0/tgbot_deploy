provider "aws" {
  region = "us-central-1"
}

resource "aws_instance" "bot_instance" {
  ami           = "ami-0e04bcbe83a83792e" # Використовуй актуальний AMI для свого регіону
  instance_type = "t3.micro"

  tags = {
    Name = "telegram-bot-instance"
  }

  # Відкриваємо порт 22 для SSH і порт 80 для HTTP
  vpc_security_group_ids = [aws_security_group.instance.id]
}

resource "aws_security_group" "instance" {
  name        = "allow_ssh_http"
  description = "Allow SSH and HTTP"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
