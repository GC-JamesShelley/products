variable "resource_group_name" {
  description = "Resource group name"
}
variable "location" {
  description = "Resource group location"
}
variable "environment" {
  description = "Enviroment name to use as a tag"
}

variable "client_id" {
  description = "Service Principal Client ID"
}

variable "client_secret" {
  description = "Service Principal Client Secret"
}

variable "namespace" {
  description = "Namespace to use on cluster and storage"
}



