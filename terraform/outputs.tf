output "resource_group_name" {
  description = "The name of the resource group."
  value       = azurerm_resource_group.main.name
}

output "postgresql_server_name" {
  description = "The name of the PostgreSQL Flexible Server."
  value       = azurerm_postgresql_flexible_server.db.name
}

# output "acr_login_server" {
#   description = "The login server of the Azure Container Registry."
#   value       = azurerm_container_registry.acr.login_server
# }

output "webapp_url" {
  description = "The default URL of the Azure Web App."
  value       = azurerm_linux_web_app.web.default_hostname
} 