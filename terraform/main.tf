terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
  required_version = ">= 1.3.0"
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_postgresql_flexible_server" "db" {
  name                   = var.db_name
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  administrator_login    = var.db_admin
  administrator_password = var.db_password
  sku_name               = "B_Standard_B1ms"
  storage_mb             = 32768
  version                = "13"
  zone                   = "1"
  backup_retention_days  = 7
  geo_redundant_backup_enabled = false
}

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true
}

resource "azurerm_service_plan" "app" {
  name                = "sbhub-app-service-plan"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "web" {
  name                = var.webapp_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  service_plan_id     = azurerm_service_plan.app.id
  
  site_config {
    application_stack {
      node_version = "18-lts"
    }
  }
  
  app_settings = {
    NODE_ENV     = "production"
    DB_HOST      = azurerm_postgresql_flexible_server.db.fqdn
    DB_PORT      = "5432"
    DB_NAME      = "session_buddy_hub"
    DB_USER      = var.db_admin
    DB_PASSWORD  = var.db_password
    JWT_SECRET   = "your-super-secret-jwt-key-here-make-it-long-and-random"
    FRONTEND_URL = "https://${var.webapp_name}.azurewebsites.net"
  }
} 