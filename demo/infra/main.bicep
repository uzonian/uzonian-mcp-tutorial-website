// Azure Bicep — Cowork MCP Server infrastructure
// Deploys: Container Apps Environment, Container App, API Management, Key Vault

@description('Base name for all resources')
param baseName string = 'cowork-mcp'

@description('Azure region for deployment')
param location string = resourceGroup().location

@description('Container image to deploy')
param containerImage string = 'ghcr.io/contoso/cowork-mcp-server:latest'

@description('Salesforce OAuth client secret (from Key Vault)')
@secure()
param salesforceClientSecret string = ''

@description('ServiceNow OAuth client secret (from Key Vault)')
@secure()
param servicenowClientSecret string = ''

@description('Jira OAuth client secret (from Key Vault)')
@secure()
param jiraClientSecret string = ''

// Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: '${baseName}-kv'
  location: location
  properties: {
    sku: { family: 'A', name: 'standard' }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
  }
}

// Container Apps Environment
resource containerEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${baseName}-env'
  location: location
  properties: {}
}

// Container App — the MCP server
resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${baseName}-app'
  location: location
  properties: {
    managedEnvironmentId: containerEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8000
        transport: 'http'
      }
      secrets: [
        { name: 'sf-secret', value: salesforceClientSecret }
        { name: 'sn-secret', value: servicenowClientSecret }
        { name: 'jira-secret', value: jiraClientSecret }
      ]
    }
    template: {
      containers: [
        {
          name: 'mcp-server'
          image: containerImage
          resources: { cpu: json('0.5'), memory: '1Gi' }
          env: [
            { name: 'MCP_SERVER_NAME', value: baseName }
            { name: 'SALESFORCE_CLIENT_SECRET', secretRef: 'sf-secret' }
            { name: 'SERVICENOW_CLIENT_SECRET', secretRef: 'sn-secret' }
            { name: 'JIRA_CLIENT_SECRET', secretRef: 'jira-secret' }
          ]
        }
      ]
      scale: { minReplicas: 1, maxReplicas: 5 }
    }
  }
}

// API Management
resource apim 'Microsoft.ApiManagement/service@2023-09-01-preview' = {
  name: '${baseName}-apim'
  location: location
  sku: { name: 'Consumption', capacity: 0 }
  properties: {
    publisherEmail: 'admin@contoso.com'
    publisherName: 'Contoso'
  }
}

output appUrl string = 'https://${containerApp.properties.configuration.ingress.fqdn}'
output keyVaultName string = keyVault.name
