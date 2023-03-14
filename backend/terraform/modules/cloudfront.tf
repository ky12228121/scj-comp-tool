locals {
  web_origin_id = aws_s3_bucket.web.id
  api_origin_id = "${aws_api_gateway_rest_api.rest_api.id}.execute-api.${data.aws_region.now.name}.amazonaws.com"
  ws_origin_id  = "${aws_apigatewayv2_api.this.id}.execute-api.${data.aws_region.now.name}.amazonaws.com"
}
resource "aws_cloudfront_distribution" "web" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_200"
  comment             = "Web static distribution of ${local.prefix}"
  wait_for_deployment = false
  aliases             = [local.site_domain]
  origin {
    domain_name              = aws_s3_bucket.web.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.web_oac.id
    origin_id                = local.web_origin_id
  }
  origin {
    domain_name = local.api_origin_id
    origin_id   = local.api_origin_id
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }
  origin {
    domain_name = local.ws_origin_id
    origin_id   = local.ws_origin_id
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.web_origin_id
    viewer_protocol_policy = "https-only"
    cache_policy_id        = var.env == "dev" ? data.aws_cloudfront_cache_policy.CachingDisabled.id : data.aws_cloudfront_cache_policy.CachingOptimized.id
    compress               = true
  }
  ordered_cache_behavior {
    path_pattern     = "websocket*"
    allowed_methods  = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.ws_origin_id
    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
      headers = ["Host", "Authorization"]
    }
    compress               = true
    viewer_protocol_policy = "https-only"
  }
  ordered_cache_behavior {
    path_pattern           = "/${aws_api_gateway_stage.this.stage_name}/*"
    allowed_methods        = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.api_origin_id
    compress               = true
    viewer_protocol_policy = "https-only"
    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }
  }
  custom_error_response {
    error_code         = 403
    response_page_path = "/"
    response_code      = 200
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn      = var.cert_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

resource "aws_cloudfront_origin_access_control" "web_oac" {
  name                              = "${local.prefix}-cf-web-oac"
  description                       = "CloudFront web origin access control of '${local.prefix}'"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}
data "aws_cloudfront_cache_policy" "CachingOptimized" {
  name = "Managed-CachingOptimized"
}
data "aws_cloudfront_cache_policy" "CachingDisabled" {
  name = "Managed-CachingDisabled"
}
