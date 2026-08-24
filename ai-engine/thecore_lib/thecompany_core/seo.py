import json
import logging
from typing import List, Optional
from google.cloud import storage

logger = logging.getLogger("thecompany_core.seo")

class KnowledgeHub:
    def __init__(self, bucket_name: str):
        self.bucket_name = bucket_name
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.bucket(bucket_name)

    def get_articles_index(self) -> List[dict]:
        """
        Fetches the index of all SEO articles.
        """
        try:
            blob = self.bucket.blob("seo_articles/articles_index.json")
            if blob.exists():
                return json.loads(blob.download_as_string())
            return []
        except Exception as e:
            logger.error(f"Failed to fetch SEO index from {self.bucket_name}: {e}")
            return []

    def get_article(self, slug: str) -> Optional[dict]:
        """
        Fetches a specific article by its slug.
        """
        try:
            blob = self.bucket.blob(f"seo_articles/{slug}.json")
            if blob.exists():
                return json.loads(blob.download_as_string())
            return None
        except Exception as e:
            logger.error(f"Failed to fetch article {slug} from {self.bucket_name}: {e}")
            return None

def init_knowledge_hub(bucket_name: str) -> KnowledgeHub:
    """
    Initializes the SEO Knowledge Hub for the current project.
    """
    return KnowledgeHub(bucket_name)
