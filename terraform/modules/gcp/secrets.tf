resource "google_secret_manager_secret" "strapi_api_token" {
  project   = var.gcp_project_id
  secret_id = "${var.project_name}-strapi-api-token"

  replication {
    auto {}
  }

  depends_on = [google_project_service.secretmanager]
}

resource "google_secret_manager_secret_version" "strapi_api_token" {
  secret      = google_secret_manager_secret.strapi_api_token.id
  secret_data = var.strapi_api_token
}

resource "google_secret_manager_secret" "n8n_webhook_url" {
  project   = var.gcp_project_id
  secret_id = "${var.project_name}-n8n-webhook-url"

  replication {
    auto {}
  }

  depends_on = [google_project_service.secretmanager]
}

resource "google_secret_manager_secret_version" "n8n_webhook_url" {
  secret      = google_secret_manager_secret.n8n_webhook_url.id
  secret_data = var.n8n_webhook_url
}
