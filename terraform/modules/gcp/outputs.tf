output "storefront_url" {
  description = "Cloud Run service URL"
  value       = google_cloud_run_v2_service.storefront.uri
}

output "artifact_registry_url" {
  description = "Artifact Registry URL for pushing Docker images"
  value       = "${var.gcp_region}-docker.pkg.dev/${var.gcp_project_id}/${var.project_name}-storefront/app"
}
