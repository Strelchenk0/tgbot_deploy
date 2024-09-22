variable "instance_trafic_size" {
  type        = string
  default     = "t3.micro"
  description = "instance size"
}

variable "ami" {
  type        = string
  default     = "ami-0e86e20dae9224db8"
  description = "instance ami"
}

