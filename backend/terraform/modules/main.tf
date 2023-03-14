locals {
  prefix      = "${var.project}-${var.env}"
  site_domain = "comp-tool${var.env == "dev" ? "-dev" : ""}.${var.domain}"
}
data "aws_caller_identity" "this" {}
data "aws_region" "now" {}
