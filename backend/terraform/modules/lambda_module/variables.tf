variable "region" {
  type    = string
  default = "ap-northeast-1"
}

variable "account_id" {
  type = number
}

variable "api_id" {
  type = string
}

variable "api_method" {
  type = string
}

variable "api_path" {
  type = string
}

variable "func_name" {
  type = string
}

variable "handler_name" {
  type = string
}

variable "role_arn" {
  type = string
}

variable "prefix" {
  type = string
}

variable "filename" {
  type = string
}

variable "source_code_hash" {
  type = string
}

variable "env_name" {
  type=string
}

variable "env" {
  type=map
}