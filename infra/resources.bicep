@description('Primary location for all resources')
param location string

@description('Tags to apply to all resources')
param tags object

var resourceToken = uniqueString(subscription().id, resourceGroup().id, location)

resource staticWebApp 'Microsoft.Web/staticSites@2024-04-01' = {
  name: 'swa-${resourceToken}'
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    allowConfigFileUpdates: true
    stagingEnvironmentPolicy: 'Enabled'
  }
  tags: union(tags, { 'azd-service-name': 'web' })
}

output staticWebAppName string = staticWebApp.name
output staticWebAppUrl string = 'https://${staticWebApp.properties.defaultHostname}'
