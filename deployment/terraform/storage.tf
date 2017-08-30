#
# S3 resources
#
module "site" {
  source           = "github.com/azavea/terraform-aws-s3-origin?ref=0.2.0"
  bucket_name      = "${lower(var.environment)}-${var.aws_region}-climate-lab-site"
  logs_bucket_name = "${lower(var.environment)}-${var.aws_region}-climate-lab-logs"
  region           = "${var.aws_region}"

  project     = "${var.project}"
  environment = "${var.environment}"
}
