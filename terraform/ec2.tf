resource "aws_instance" "bot_instance" {
  ami           = var.ami      # Використовуйте актуальний AMI для свого регіону
  instance_type = var.instance_trafic_size
  key_name      = aws_key_pair.app_keypair.key_name  # Виправлено на ключове ім'я
  vpc_security_group_ids = [aws_security_group.instance.id]

  tags = {
    Name = "telegram_bot"
  }
}

resource "aws_key_pair" "app_keypair" {
  public_key = file(var.public_path)
  key_name   = "my_key"
}
  
resource "aws_eip" "elastic_ip" {
  domain   = "vpc"
  instance = aws_instance.bot_instance.id 
}

output "elastic_ip" {
  value = aws_eip.elastic_ip.public_ip
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
