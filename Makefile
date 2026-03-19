AWS_REGION     ?= eu-central-1
AWS_ACCOUNT_ID ?=
GCP_PROJECT_ID ?=
GCP_REGION     ?= europe-west1
PROJECT_NAME   := storefront
IMAGE_TAG      ?= latest

AWS_ECR_URL    := $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/$(PROJECT_NAME)-storefront
GCP_AR_URL     := $(GCP_REGION)-docker.pkg.dev/$(GCP_PROJECT_ID)/$(PROJECT_NAME)-storefront/app

.PHONY: help dev dev-down dev-clean build push-aws push-gcp \
        plan-aws plan-gcp deploy-aws deploy-gcp \
        status-aws status-gcp destroy-aws destroy-gcp \
        _check-terraform _check-docker _check-aws _check-gcp

help: ## Show all available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ─── Local Development ──────────────────────────────────────────────────────

dev: _check-docker ## Start storefront container on port 3002
	docker compose up -d
	@echo "Storefront running at http://localhost:3002"

dev-down: ## Stop storefront container
	docker compose down

dev-clean: ## Stop container and remove volumes
	docker compose down -v

# ─── Build ──────────────────────────────────────────────────────────────────

build: _check-docker ## Build Docker image (linux/amd64)
	docker build --platform linux/amd64 -t $(PROJECT_NAME):$(IMAGE_TAG) -f docker/Dockerfile .

# ─── AWS ────────────────────────────────────────────────────────────────────

push-aws: _check-docker _check-aws build ## Build and push image to AWS ECR
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com
	docker tag $(PROJECT_NAME):$(IMAGE_TAG) $(AWS_ECR_URL):$(IMAGE_TAG)
	docker push $(AWS_ECR_URL):$(IMAGE_TAG)

plan-aws: _check-terraform ## Run Terraform plan for AWS
	terraform -chdir=terraform/aws init -input=false
	terraform -chdir=terraform/aws plan -var="image_tag=$(IMAGE_TAG)"

deploy-aws: push-aws ## Full deploy to AWS (build → push → terraform apply)
	terraform -chdir=terraform/aws init -input=false
	terraform -chdir=terraform/aws apply -auto-approve -var="image_tag=$(IMAGE_TAG)"
	@$(MAKE) status-aws

status-aws: _check-terraform ## Show AWS deployment status (App URL)
	terraform -chdir=terraform/aws output

destroy-aws: _check-terraform ## Destroy AWS infrastructure (with confirmation)
	@read -p "Really destroy AWS infrastructure? [y/N] " confirm && [ "$$confirm" = "y" ] || (echo "Aborted." && exit 1)
	terraform -chdir=terraform/aws destroy -auto-approve

# ─── GCP ────────────────────────────────────────────────────────────────────

push-gcp: _check-docker _check-gcp build ## Build and push image to GCP Artifact Registry
	gcloud auth configure-docker $(GCP_REGION)-docker.pkg.dev --quiet
	docker tag $(PROJECT_NAME):$(IMAGE_TAG) $(GCP_AR_URL):$(IMAGE_TAG)
	docker push $(GCP_AR_URL):$(IMAGE_TAG)

plan-gcp: _check-terraform ## Run Terraform plan for GCP
	terraform -chdir=terraform/gcp init -input=false
	terraform -chdir=terraform/gcp plan -var="gcp_project_id=$(GCP_PROJECT_ID)" -var="image_tag=$(IMAGE_TAG)"

deploy-gcp: push-gcp ## Full deploy to GCP (build → push → terraform apply)
	terraform -chdir=terraform/gcp init -input=false
	terraform -chdir=terraform/gcp apply -auto-approve -var="gcp_project_id=$(GCP_PROJECT_ID)" -var="image_tag=$(IMAGE_TAG)"
	@$(MAKE) status-gcp

status-gcp: _check-terraform ## Show GCP deployment status (App URL)
	terraform -chdir=terraform/gcp output

destroy-gcp: _check-terraform ## Destroy GCP infrastructure (with confirmation)
	@read -p "Really destroy GCP infrastructure? [y/N] " confirm && [ "$$confirm" = "y" ] || (echo "Aborted." && exit 1)
	terraform -chdir=terraform/gcp destroy -auto-approve -var="gcp_project_id=$(GCP_PROJECT_ID)"

# ─── Prerequisite Checks ────────────────────────────────────────────────────

_check-terraform:
	@which terraform > /dev/null 2>&1 || (echo "Error: terraform not found. Install from https://developer.hashicorp.com/terraform/install" && exit 1)

_check-docker:
	@which docker > /dev/null 2>&1 || (echo "Error: docker not found. Install from https://docs.docker.com/get-docker/" && exit 1)
	@docker info > /dev/null 2>&1 || (echo "Error: Docker daemon not running." && exit 1)

_check-aws:
	@which aws > /dev/null 2>&1 || (echo "Error: aws CLI not found. Install from https://aws.amazon.com/cli/" && exit 1)
	@test -n "$(AWS_ACCOUNT_ID)" || (echo "Error: AWS_ACCOUNT_ID is not set." && exit 1)

_check-gcp:
	@which gcloud > /dev/null 2>&1 || (echo "Error: gcloud CLI not found. Install from https://cloud.google.com/sdk/docs/install" && exit 1)
	@test -n "$(GCP_PROJECT_ID)" || (echo "Error: GCP_PROJECT_ID is not set." && exit 1)
