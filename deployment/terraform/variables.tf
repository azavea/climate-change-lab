variable "project" {
  default = "Climate Change Lab"
}

variable "environment" {}

variable "aws_region" {
  default = "us-east-1"
}

variable "aws_certificate_arn" {}

variable "r53_public_hosted_zone_name" {}

variable "r53_public_hosted_zone_id" {}

variable "git_commit" {}
