resource "aws_lambda_permission" "this" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${var.region}:${var.account_id}:${var.api_id}/${var.env_name}/${var.api_method}${var.api_path}"
}
resource "aws_lambda_function" "this" {
  filename         = var.filename
  function_name    = "${var.prefix}-${var.func_name}-func"
  role             = var.role_arn
  handler          = "handler.${var.handler_name}"
  runtime          = "python3.9"
  timeout = 600
  source_code_hash = var.source_code_hash
  environment {
    variables=var.env
  }
}


