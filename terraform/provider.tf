terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.34.0"  # Це дозволить використовувати всі версії 5.34.0 і новіші
    }
  }

  required_version = ">= 1.7"
}

provider "aws" {
  region = "us-east-1"
}
