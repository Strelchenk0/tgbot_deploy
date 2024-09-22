

resource "aws_instance" "bot_instance" {
  count = 3
  ami           = var.ami      # Використовуй актуальний AMI для свого регіону
  instance_type = var.instance_trafic_size

  tags = {
    Name = "telegram_bot_instance${count.index+1}"
  }
}
  
resource "aws_eip" "elastic_ip" {
  count = 3
  vpc = true
  instance = aws_instance.bot_instance[count.index].id 
}

resource "aws_s3_bucket" "example" {
  bucket = "nazarsbucket"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
  depends_on = [aws_instance.bot_instance]
}
/////

# Відкриваємо порт 22 для SSH і порт 80 для HTTP
#   vpc_security_group_ids = [aws_security_group.instance.id]
# }

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
