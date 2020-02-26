provider "azurerm" {
  version = "~>1.38.0"
}

terraform {
  backend "azurerm" {
    resource_group_name = "tfstate"
    key                 = "prod.terraform.tfstate"
  }
}

locals {
  resource_group_name = var.RESOURCE_GROUP_PRODUCTS
  location            = var.REGION
  environment         = var.ENVIRONMENT
  client_id           = var.CLIENT_ID
  client_secret       = var.CLIENT_SECRET
}

# website
module "products" {
  source = "../../modules/products"

  environment         = local.environment
  location            = local.location
  resource_group_name = local.resource_group_name
}

# AKS
module cluster {
  source = "../../modules/cluster"

  client_id           = local.client_id
  client_secret       = local.client_secret
  environment         = local.environment
  location            = local.location
  resource_group_name = local.resource_group_name
}

# CPD
module cpd {
  source = "../../modules/cpd"

  environment         = local.environment
  location            = local.location
  resource_group_name = local.resource_group_name
}

# Service Bus
module service_bus {
  source = "../../modules/service-bus"

  client_id           = local.client_id
  client_secret       = local.client_secret
  environment         = local.environment
  location            = local.location
  resource_group_name = local.resource_group_name
  name                = "doc-index-updater-prod"
}
