data "aws_route53_zone" "scj_domain" {
  name         = var.domain
}

resource "aws_route53_record" "comp_tool" {
  zone_id = data.aws_route53_zone.scj_domain.zone_id
  name = local.site_domain
  type = "A"
  alias {
    name = aws_cloudfront_distribution.web.domain_name
    zone_id = aws_cloudfront_distribution.web.hosted_zone_id
    evaluate_target_health = false
  }
}