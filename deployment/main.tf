provider "aws" {
  region = "ap-south-1"
}

# Fetch the Hosted Zone
data "aws_route53_zone" "main" {
  name = "todo-backend.com"
}

# Terraform Variable for LoadBalancer DNS
variable "backend_lb_dns" {
  type    = string
  default = ""
}

# Health Check for LB
resource "aws_route53_health_check" "backend_health" {
  fqdn              = var.backend_lb_dns
  port              = 4000
  type              = "HTTP"
  resource_path     = "/health"
  failure_threshold = 3
  request_interval  = 30
}

# Route 53 Record with Latency-Based Routing
resource "aws_route53_record" "backend_dns" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "backend.todo-backend.com"
  type    = "CNAME"
  ttl     = 300
  records = [var.backend_lb_dns]

  set_identifier  = "backend-ap-south-1"
  health_check_id = aws_route53_health_check.backend_health.id

  latency_routing_policy {
    region = "ap-south-1"
  }
}