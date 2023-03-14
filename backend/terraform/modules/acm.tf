data "aws_acm_certificate" "scj_cert_reginal" {
  domain = var.domain
  types  = ["AMAZON_ISSUED"]
}
