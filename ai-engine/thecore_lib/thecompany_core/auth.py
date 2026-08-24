import os
import logging
try:
    from google.cloud import secret_manager
except ImportError:
    import google.cloud.secretmanager as secret_manager
from google.auth import default

logger = logging.getLogger(__name__)

def get_secret(secret_id, project_id=None):
    """
    Accesses the payload for the given secret; version is 'latest'.
    V2.5.1 SOVEREIGN UTILITY
    """
    if not project_id:
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        if not project_id:
            # Fallback check for credentials
            _, project_id = default()
            
    if not project_id:
        raise ValueError("[TheCore/Auth] CRITICAL: Project ID could not be determined for secret retrieval.")

    client = secret_manager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/latest"
    
    logger.info(f"[TheCore/Auth] Accessing Imperial Vault: {secret_id}")
    
    try:
        response = client.access_secret_version(request={"name": name})
        return response.payload.data.decode("UTF-8")
    except Exception as e:
        logger.warning(f"[TheCore/Auth] Vault Access Failed for {secret_id}: {e}")
        return None
