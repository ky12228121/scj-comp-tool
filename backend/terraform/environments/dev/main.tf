terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  required_version = ">= 1.2.0"
  backend "s3" {
    key    = "scj-comp-tool/dev/terraform.tfstate"
    region = "ap-northeast-1"
  }
}

data "aws_acm_certificate" "scj_cert" {
  domain   = var.domain
  types    = ["AMAZON_ISSUED"]
  provider = aws.us
}


module "develop_environment" {
  source   = "../../modules"
  project  = "scj-comp-tool"
  env      = "dev"
  domain   = var.domain
  cert_arn = data.aws_acm_certificate.scj_cert.arn
}
