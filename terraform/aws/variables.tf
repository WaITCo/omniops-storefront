variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-central-1"
}

variable "project_name" {
  description = "Project name prefix for all resources"
  type        = string
  default     = "storefront"
}

variable "image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

variable "strapi_url" {
  description = "Public URL of the Strapi CMS instance"
  type        = string
}

variable "strapi_api_token" {
  description = "Strapi API token (sensitive)"
  type        = string
  sensitive   = true
}

variable "n8n_webhook_url" {
  description = "n8n webhook URL for order notifications"
  type        = string
  sensitive   = true
}

variable "site_url" {
  description = "Public URL of the storefront"
  type        = string
}
