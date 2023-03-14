provider "aws" {
  region = "ap-northeast-1"
  default_tags {
    tags = {
      project = "scj-comp-tool"
      env     = "dev"
    }
  }
}
provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      project = "scj-comp-tool"
      env     = "dev"
    }
  }
  alias = "us"
}
