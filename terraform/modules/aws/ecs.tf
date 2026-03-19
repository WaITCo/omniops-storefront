data "aws_caller_identity" "current" {}

resource "aws_cloudwatch_log_group" "storefront" {
  name              = "/ecs/${var.project_name}-storefront"
  retention_in_days = 7
}

resource "aws_ssm_parameter" "strapi_api_token" {
  name  = "/${var.project_name}/STRAPI_API_TOKEN"
  type  = "SecureString"
  value = var.strapi_api_token
}

resource "aws_ssm_parameter" "n8n_webhook_url" {
  name  = "/${var.project_name}/N8N_WEBHOOK_URL"
  type  = "SecureString"
  value = var.n8n_webhook_url
}

resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.project_name}-ecs-task-execution"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "ecs_ssm" {
  name = "${var.project_name}-ecs-ssm"
  role = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["ssm:GetParameters", "ssm:GetParameter"]
      Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${var.project_name}/*"
    }]
  })
}

resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
}

resource "aws_ecs_task_definition" "storefront" {
  family                   = "${var.project_name}-storefront"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn

  container_definitions = jsonencode([{
    name  = "storefront"
    image = "${aws_ecr_repository.storefront.repository_url}:${var.image_tag}"
    portMappings = [{ containerPort = 3000, protocol = "tcp" }]
    environment = [
      { name = "NEXT_PUBLIC_STRAPI_URL", value = var.strapi_url },
      { name = "NEXT_PUBLIC_SITE_URL",   value = var.site_url },
      { name = "NODE_ENV",               value = "production" }
    ]
    secrets = [
      { name = "STRAPI_API_TOKEN", valueFrom = aws_ssm_parameter.strapi_api_token.arn },
      { name = "N8N_WEBHOOK_URL",  valueFrom = aws_ssm_parameter.n8n_webhook_url.arn }
    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.storefront.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])
}

resource "aws_ecs_service" "storefront" {
  name            = "${var.project_name}-storefront"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.storefront.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.storefront.arn
    container_name   = "storefront"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.http]
}
