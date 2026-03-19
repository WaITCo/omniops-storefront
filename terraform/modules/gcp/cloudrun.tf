data "google_compute_default_service_account" "default" {
  project = var.gcp_project_id
}

resource "google_cloud_run_v2_service" "storefront" {
  project  = var.gcp_project_id
  name     = "${var.project_name}-storefront"
  location = var.gcp_region

  template {
    scaling {
      min_instance_count = 1
      max_instance_count = 3
    }

    containers {
      image = "${var.gcp_region}-docker.pkg.dev/${var.gcp_project_id}/${var.project_name}-storefront/app:${var.image_tag}"

      ports {
        container_port = 3000
      }

      resources {
        limits = {
          memory = "512Mi"
          cpu    = "1"
        }
      }

      env {
        name  = "NEXT_PUBLIC_STRAPI_URL"
        value = var.strapi_url
      }

      env {
        name  = "NEXT_PUBLIC_SITE_URL"
        value = var.site_url
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }

      env {
        name = "STRAPI_API_TOKEN"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.strapi_api_token.secret_id
            version = "latest"
          }
        }
      }

      env {
        name = "N8N_WEBHOOK_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.n8n_webhook_url.secret_id
            version = "latest"
          }
        }
      }

      startup_probe {
        http_get {
          path = "/api/health"
          port = 3000
        }
        initial_delay_seconds = 10
        period_seconds        = 5
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/api/health"
          port = 3000
        }
        period_seconds    = 30
        failure_threshold = 3
      }
    }
  }

  depends_on = [
    google_project_service.run,
    google_secret_manager_secret_version.strapi_api_token,
    google_secret_manager_secret_version.n8n_webhook_url,
  ]
}

resource "google_cloud_run_v2_service_iam_member" "public" {
  project  = var.gcp_project_id
  location = var.gcp_region
  name     = google_cloud_run_v2_service.storefront.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_secret_manager_secret_iam_member" "strapi_token_run" {
  project   = var.gcp_project_id
  secret_id = google_secret_manager_secret.strapi_api_token.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${data.google_compute_default_service_account.default.email}"
}

resource "google_secret_manager_secret_iam_member" "n8n_url_run" {
  project   = var.gcp_project_id
  secret_id = google_secret_manager_secret.n8n_webhook_url.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${data.google_compute_default_service_account.default.email}"
}
