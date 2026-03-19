resource "google_artifact_registry_repository" "storefront" {
  project       = var.gcp_project_id
  location      = var.gcp_region
  repository_id = "${var.project_name}-storefront"
  description   = "Docker images for omniops storefront"
  format        = "DOCKER"

  depends_on = [google_project_service.artifactregistry]
}
