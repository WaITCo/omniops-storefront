output "storefront_url" {
  description = "Cloud Run service URL"
  value       = module.gcp.storefront_url
}

output "artifact_registry_url" {
  description = "Artifact Registry URL for pushing Docker images"
  value       = module.gcp.artifact_registry_url
}
