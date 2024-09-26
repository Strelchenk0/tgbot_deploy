

resource "aws_instance" "bot_instance" {
  ami           = var.ami      # Використовуй актуальний AMI для свого регіону
  instance_type = var.instance_trafic_size

  tags = {
    Name = "telegram_bot_instance"
  }
}
  
resource "aws_eip" "elastic_ip" {
  domain   = "vpc"
  instance = aws_instance.bot_instance.id 
}

output "instance_ip" {
  value = aws_instance.bot_instance.public_ip
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
