output "api_method" {
  value = aws_api_gateway_method.main.http_method
}
output "api_path" {
  value = aws_api_gateway_resource.this.path
}