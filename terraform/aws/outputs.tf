output "storefront_url" {
  description = "ALB DNS name (public URL of the storefront)"
  value       = "http://${module.aws.alb_dns_name}"
}

output "ecr_repository_url" {
  description = "ECR repository URL for pushing Docker images"
  value       = module.aws.ecr_repository_url
}
