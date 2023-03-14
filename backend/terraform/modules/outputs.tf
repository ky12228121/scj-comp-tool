output "api_gateway_url" {
  value = "https://${local.site_domain}/${aws_api_gateway_stage.this.stage_name}"
}

output "websocket_url" {
  value = "wss://${local.site_domain}/websocket"
}
output "web_url" {
  value = "https://${local.site_domain}"
}
