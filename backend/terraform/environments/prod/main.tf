terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  required_version = ">= 1.2.0"
  backend "s3" {
    key    = "scj-comp-tool/prod/terraform.tfstate"
    region = "ap-northeast-1"
  }
}

data "aws_acm_certificate" "scj_cert" {
  domain   = var.domain
  types    = ["AMAZON_ISSUED"]
  provider = aws.us
}

module "production_environment" {
  source   = "../../modules"
  project  = "scj-comp-tool"
  env      = "prod"
  domain   = var.domain
  cert_arn = data.aws_acm_certificate.scj_cert.arn
}
