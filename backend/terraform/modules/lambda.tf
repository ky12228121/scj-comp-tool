module "room_get_func" {
  source           = "./lambda_module"
  prefix           = local.prefix
  filename         = "room_func.zip"
  account_id       = data.aws_caller_identity.this.account_id
  api_id           = aws_api_gateway_rest_api.rest_api.id
  api_method       = module.room_get.api_method
  api_path         = module.room_get.api_path
  func_name        = "room-get"
  handler_name     = "room_get"
  role_arn         = aws_iam_role.this.arn
  source_code_hash = data.archive_file.room.output_base64sha256
  env_name         = var.env
  env = {
    room_table_name = aws_dynamodb_table.room.id
  }
}
module "room_create_func" {
  source           = "./lambda_module"
  prefix           = local.prefix
  filename         = "room_func.zip"
  account_id       = data.aws_caller_identity.this.account_id
  api_id           = aws_api_gateway_rest_api.rest_api.id
  api_method       = module.room_create.api_method
  api_path         = module.room_create.api_path
  func_name        = "room-create"
  handler_name     = "room_create"
  role_arn         = aws_iam_role.this.arn
  source_code_hash = data.archive_file.room.output_base64sha256
  env_name         = var.env
  env = {
    room_table_name = aws_dynamodb_table.room.id
  }

}
module "room_remove_func" {
  source           = "./lambda_module"
  prefix           = local.prefix
  filename         = "room_func.zip"
  account_id       = data.aws_caller_identity.this.account_id
  api_id           = aws_api_gateway_rest_api.rest_api.id
  api_method       = module.room_remove.api_method
  api_path         = module.room_remove.api_path
  func_name        = "room-remove"
  handler_name     = "room_remove"
  role_arn         = aws_iam_role.this.arn
  source_code_hash = data.archive_file.room.output_base64sha256
  env_name         = var.env
  env = {
    room_table_name = aws_dynamodb_table.room.id
  }

}

module "input_get_func" {
  source           = "./lambda_module"
  prefix           = local.prefix
  filename         = "input_func.zip"
  account_id       = data.aws_caller_identity.this.account_id
  api_id           = aws_api_gateway_rest_api.rest_api.id
  api_method       = module.input_get.api_method
  api_path         = module.input_get.api_path
  func_name        = "input-get"
  handler_name     = "input_get"
  role_arn         = aws_iam_role.this.arn
  source_code_hash = data.archive_file.input.output_base64sha256
  env_name         = var.env
  env = {
    input_table_name = aws_dynamodb_table.input.id
  }

}

module "input_register_func" {
  source           = "./lambda_module"
  prefix           = local.prefix
  filename         = "input_func.zip"
  account_id       = data.aws_caller_identity.this.account_id
  api_id           = aws_api_gateway_rest_api.rest_api.id
  api_method       = module.input_register.api_method
  api_path         = module.input_register.api_path
  func_name        = "input-register"
  handler_name     = "input_register"
  role_arn         = aws_iam_role.this.arn
  source_code_hash = data.archive_file.input.output_base64sha256
  env_name         = var.env
  env = {
    input_table_name   = aws_dynamodb_table.input.id
    session_table_name = aws_dynamodb_table.session.id
    ws_endpoint        = "https://${aws_apigatewayv2_api.this.id}.execute-api.ap-northeast-1.amazonaws.com/${var.env}"
  }
}
module "input_delete_func" {
  source           = "./lambda_module"
  prefix           = local.prefix
  filename         = "input_func.zip"
  account_id       = data.aws_caller_identity.this.account_id
  api_id           = aws_api_gateway_rest_api.rest_api.id
  api_method       = module.input_delete.api_method
  api_path         = module.input_delete.api_path
  func_name        = "input-delete"
  handler_name     = "input_delete"
  role_arn         = aws_iam_role.this.arn
  source_code_hash = data.archive_file.input.output_base64sha256
  env_name         = var.env
  env = {
    input_table_name   = aws_dynamodb_table.input.id
    session_table_name = aws_dynamodb_table.session.id
    ws_endpoint        = "https://${aws_apigatewayv2_api.this.id}.execute-api.ap-northeast-1.amazonaws.com/${var.env}"
  }
}

resource "aws_lambda_permission" "ws_connect_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ws_connect_func.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:ap-northeast-1:${data.aws_caller_identity.this.account_id}:${aws_apigatewayv2_api.this.id}/${var.env}/$connect"
}
resource "aws_lambda_function" "ws_connect_func" {
  filename         = "ws_func.zip"
  function_name    = "${local.prefix}-ws-connect-func"
  role             = aws_iam_role.this.arn
  handler          = "handler.connect"
  runtime          = "python3.9"
  source_code_hash = data.archive_file.ws.output_base64sha256
  environment {
    variables = { session_table_name = aws_dynamodb_table.session.id }
  }
}
resource "aws_lambda_permission" "ws_default_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ws_default_func.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:ap-northeast-1:${data.aws_caller_identity.this.account_id}:${aws_apigatewayv2_api.this.id}/${var.env}/$default"
}
resource "aws_lambda_function" "ws_default_func" {
  filename         = "ws_func.zip"
  function_name    = "${local.prefix}-ws-default-func"
  role             = aws_iam_role.this.arn
  handler          = "handler.default"
  runtime          = "python3.9"
  source_code_hash = data.archive_file.ws.output_base64sha256
  environment {
    variables = { session_table_name = aws_dynamodb_table.session.id }
  }
}
resource "aws_lambda_permission" "ws_disconnect_permission" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ws_disconnect_func.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:ap-northeast-1:${data.aws_caller_identity.this.account_id}:${aws_apigatewayv2_api.this.id}/${var.env}/$disconnect"
}
resource "aws_lambda_function" "ws_disconnect_func" {
  filename         = "ws_func.zip"
  function_name    = "${local.prefix}-ws-disconnect-func"
  role             = aws_iam_role.this.arn
  handler          = "handler.disconnect"
  runtime          = "python3.9"
  source_code_hash = data.archive_file.ws.output_base64sha256
  environment {
    variables = { session_table_name = aws_dynamodb_table.session.id }
  }
}

data "archive_file" "room" {
  type        = "zip"
  source_dir  = "../../../functions/room"
  output_path = "room_func.zip"
}

data "archive_file" "input" {
  type        = "zip"
  source_dir  = "../../../functions/input"
  output_path = "input_func.zip"
}
data "archive_file" "ws" {
  type        = "zip"
  source_dir  = "../../../functions/websocket"
  output_path = "ws_func.zip"
}


data "aws_iam_policy" "AWSLambdaBasicExecutionRole" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_iam_role" "this" {
  name = "${local.prefix}-lambda-role"
  assume_role_policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Action" : "sts:AssumeRole",
          "Principal" : {
            "Service" : "lambda.amazonaws.com"
          },
          "Effect" : "Allow",
          "Sid" : ""
        }
      ]
    }
  )
}

resource "aws_iam_role_policy" "this" {
  name = "${local.prefix}-lambda-policy"
  role = aws_iam_role.this.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "dynamodb:*"
        ]
        Effect = "Allow"
        Resource = [
          aws_dynamodb_table.room.arn,
          aws_dynamodb_table.input.arn,
          aws_dynamodb_table.session.arn
        ]
      },
      {
        Action = [
          "execute-api:*"
        ]
        Effect = "Allow"
        Resource = [
          "${aws_apigatewayv2_stage.this.execution_arn}/*/*/*"
        ]
      },
    ]
  })
}
resource "aws_iam_role_policy_attachment" "this" {
  role       = aws_iam_role.this.name
  policy_arn = data.aws_iam_policy.AWSLambdaBasicExecutionRole.arn
}
