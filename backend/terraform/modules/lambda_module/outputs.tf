output "invoke_arn" {
  value = aws_lambda_function.this.invoke_arn
}

output "func_name" {
  value = aws_lambda_function.this.function_name
}