resource "aws_api_gateway_rest_api" "rest_api" {
  name        = "${local.prefix}-rest-api"
  description = "Rest api of ${local.prefix}"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
  disable_execute_api_endpoint = false
}
resource "aws_api_gateway_resource" "room" {
  path_part   = "room"
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
}
resource "aws_api_gateway_resource" "input" {
  path_part   = "input"
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
}

module "room_get" {
  source            = "./api_gateway_module"
  api_id            = aws_api_gateway_rest_api.rest_api.id
  parent_id         = aws_api_gateway_resource.room.id
  path              = "get"
  method            = "GET"
  lambda_invoke_arn = module.room_get_func.invoke_arn
}
module "room_create" {
  source            = "./api_gateway_module"
  api_id            = aws_api_gateway_rest_api.rest_api.id
  parent_id         = aws_api_gateway_resource.room.id
  path              = "create"
  method            = "POST"
  lambda_invoke_arn = module.room_create_func.invoke_arn
}
module "room_remove" {
  source            = "./api_gateway_module"
  api_id            = aws_api_gateway_rest_api.rest_api.id
  parent_id         = aws_api_gateway_resource.room.id
  path              = "remove"
  method            = "POST"
  lambda_invoke_arn = module.room_remove_func.invoke_arn
}

module "input_get" {
  source            = "./api_gateway_module"
  api_id            = aws_api_gateway_rest_api.rest_api.id
  parent_id         = aws_api_gateway_resource.input.id
  path              = "get"
  method            = "GET"
  lambda_invoke_arn = module.input_get_func.invoke_arn
}
module "input_register" {
  source            = "./api_gateway_module"
  api_id            = aws_api_gateway_rest_api.rest_api.id
  parent_id         = aws_api_gateway_resource.input.id
  path              = "register"
  method            = "POST"
  lambda_invoke_arn = module.input_register_func.invoke_arn
}
module "input_delete" {
  source            = "./api_gateway_module"
  api_id            = aws_api_gateway_rest_api.rest_api.id
  parent_id         = aws_api_gateway_resource.input.id
  path              = "delete"
  method            = "POST"
  lambda_invoke_arn = module.input_delete_func.invoke_arn
}

resource "aws_api_gateway_gateway_response" "code_4xx" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  response_type = "DEFAULT_4XX"

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }
  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'*'",
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'",
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

resource "aws_api_gateway_gateway_response" "code_5xx" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  response_type = "DEFAULT_5XX"

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }
  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Headers" = "'*'",
    "gatewayresponse.header.Access-Control-Allow-Methods" = "'GET,OPTIONS,POST'",
    "gatewayresponse.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  triggers = {
    redeployment = filesha1("${path.module}/api_gateway.tf")
  }
  lifecycle {
    create_before_destroy = true
  }
  depends_on = [
    module.room_get,
    module.room_create,
    module.room_remove,
    module.input_get,
    module.input_register,
    module.input_delete
  ]
}

resource "aws_api_gateway_stage" "this" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  stage_name    = var.env
  depends_on = [
    aws_cloudwatch_log_group.api_gateway
  ]
}

resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "API-Gateway-Execution-Logs_${aws_api_gateway_rest_api.rest_api.id}/${var.env}"
  retention_in_days = 30
}


resource "aws_apigatewayv2_api" "this" {
  name                       = "${local.prefix}-websocket-api"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_route" "connect" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.connect.id}"
}
resource "aws_apigatewayv2_integration" "connect" {
  api_id                    = aws_apigatewayv2_api.this.id
  integration_type          = "AWS_PROXY"
  connection_type           = "INTERNET"
  content_handling_strategy = "CONVERT_TO_TEXT"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.ws_connect_func.invoke_arn
  passthrough_behavior      = "WHEN_NO_MATCH"
}
resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.default.id}"
}
resource "aws_apigatewayv2_integration" "default" {
  api_id                    = aws_apigatewayv2_api.this.id
  integration_type          = "AWS_PROXY"
  connection_type           = "INTERNET"
  content_handling_strategy = "CONVERT_TO_TEXT"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.ws_default_func.invoke_arn
  passthrough_behavior      = "WHEN_NO_MATCH"
}
resource "aws_apigatewayv2_route" "disconnect" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.disconnect.id}"
}
resource "aws_apigatewayv2_integration" "disconnect" {
  api_id                    = aws_apigatewayv2_api.this.id
  integration_type          = "AWS_PROXY"
  connection_type           = "INTERNET"
  content_handling_strategy = "CONVERT_TO_TEXT"
  integration_method        = "POST"
  integration_uri           = aws_lambda_function.ws_disconnect_func.invoke_arn
  passthrough_behavior      = "WHEN_NO_MATCH"
}
resource "aws_apigatewayv2_deployment" "deployment" {
  api_id = aws_apigatewayv2_api.this.id
  triggers = {
    redeployment = filesha1("${path.module}/api_gateway.tf")
  }
  lifecycle {
    create_before_destroy = true
  }
  depends_on = [
    aws_apigatewayv2_route.connect,
    aws_apigatewayv2_integration.connect,
    aws_apigatewayv2_route.default,
    aws_apigatewayv2_integration.default,
    aws_apigatewayv2_route.disconnect,
    aws_apigatewayv2_integration.disconnect,
  ]
}

resource "aws_apigatewayv2_stage" "this" {
  deployment_id = aws_apigatewayv2_deployment.deployment.id
  api_id        = aws_apigatewayv2_api.this.id
  name          = var.env
  default_route_settings {
    throttling_burst_limit = 5000
    throttling_rate_limit  = 10000
  }
}

resource "aws_apigatewayv2_domain_name" "this" {
  domain_name = local.site_domain
  domain_name_configuration {
    certificate_arn = data.aws_acm_certificate.scj_cert_reginal.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "websocket" {
  api_id          = aws_apigatewayv2_api.this.id
  stage           = aws_apigatewayv2_stage.this.name
  domain_name     = aws_apigatewayv2_domain_name.this.domain_name
  api_mapping_key = "websocket"
}
