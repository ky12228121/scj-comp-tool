resource "aws_dynamodb_table" "room" {
  name         = "${local.prefix}-room"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "room_id"
  attribute {
    name = "room_id"
    type = "N"
  }
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "session" {
  name         = "${local.prefix}-session"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "room_id"
  range_key    = "session_id"
  attribute {
    name = "room_id"
    type = "N"
  }
  attribute {
    name = "session_id"
    type = "S"
  }
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "input" {
  name         = "${local.prefix}-input"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "room_id"
  range_key    = "scj_id"
  attribute {
    name = "room_id"
    type = "N"
  }
  attribute {
    name = "scj_id"
    type = "N"
  }
  # attribute {
  #   name = "first"
  #   type = "N"
  # }
  # attribute {
  #   name = "second"
  #   type = "N"
  # }
  # attribute {
  #   name = "third"
  #   type = "N"
  # }
  # attribute {
  #   name = "force"
  #   type = "N"
  # }
  # attribute {
  #   name = "fifth"
  #   type = "N"
  # }
  # attribute {
  #   name = "best"
  #   type = "N"
  # }
  # attribute {
  #   name = "average"
  #   type = "N"
  # }
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
}
