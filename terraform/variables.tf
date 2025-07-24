variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "sbhub-rg"
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "East US"
}

variable "db_name" {
  description = "PostgreSQL Flexible Server name"
  type        = string
  default     = "sbhub-db"
}

variable "db_admin" {
  description = "Database admin username"
  type        = string
  default     = "pgadmin"
}

variable "db_password" {
  description = "Database admin password"
  type        = string
  sensitive   = true
}

variable "acr_name" {
  description = "Azure Container Registry name (must be globally unique, 5-50 alphanumeric)"
  type        = string
}

variable "webapp_name" {
  description = "Azure Web App for Containers name (must be globally unique)"
  type        = string
} 