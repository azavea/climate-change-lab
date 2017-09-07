resource "aws_route53_record" "site" {
  zone_id = "${var.r53_public_hosted_zone_id}"
  name    = "lab.${var.r53_public_hosted_zone_name}"
  type    = "A"

  alias {
    name                   = "${aws_cloudfront_distribution.cdn.domain_name}"
    zone_id                = "${aws_cloudfront_distribution.cdn.hosted_zone_id}"
    evaluate_target_health = false
  }
}
