"""Application configuration via environment variables (pydantic-settings)."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """All configuration is read from environment variables or a .env file."""

    mcp_server_name: str = "cowork-mcp-server"

    # External system base URLs
    salesforce_base_url: str = "https://yourorg.my.salesforce.com"
    servicenow_base_url: str = "https://yourinstance.service-now.com"
    jira_base_url: str = "https://yourorg.atlassian.net"

    # Response safety limits
    max_response_bytes: int = 8192
    max_results: int = 25

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
