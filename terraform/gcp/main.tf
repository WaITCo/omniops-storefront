terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

module "gcp" {
  source           = "../modules/gcp"
  gcp_project_id   = var.gcp_project_id
  gcp_region       = var.gcp_region
  project_name     = var.project_name
  image_tag        = var.image_tag
  strapi_url       = var.strapi_url
  strapi_api_token = var.strapi_api_token
  n8n_webhook_url  = var.n8n_webhook_url
  site_url         = var.site_url
}
