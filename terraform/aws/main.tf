terraform {
  required_version = ">= 1.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "aws" {
  source           = "../modules/aws"
  aws_region       = var.aws_region
  project_name     = var.project_name
  image_tag        = var.image_tag
  strapi_url       = var.strapi_url
  strapi_api_token = var.strapi_api_token
  n8n_webhook_url  = var.n8n_webhook_url
  site_url         = var.site_url
}
