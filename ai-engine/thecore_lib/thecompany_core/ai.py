import os
import logging
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)
_genai_client = None

# 2026 Modern Model Registry - Sovereign Upgrade
MODELS = {
    "pro": "gemini-2.5-pro",
    "flash": "gemini-2.5-flash",
    "pro_exp": "gemini-3.1-pro",
    "flash_exp": "gemini-3.1-flash-lite",
    "lite": "gemini-3.1-flash-lite",
    "video": "gemini-2.5-pro",
    "audio": "gemini-2.5-pro",
    "computer": "gemini-3.1-pro",
    "image": "imagen-3"
}

def initCoreAI(api_key: str = None, project: str = None, location: str = "us-central1"):
    """
    Initializes the Unified GenAI Client.
    V2 MANDATE: Defaults to Identity-based Auth (Vertex AI).
    API Key is ONLY used if explicitly provided as an argument.
    """
    global _genai_client
    
    # We ignore os.getenv("GEMINI_API_KEY") to prevent hijacking identity auth
    key = api_key 
    proj = project or os.getenv("GOOGLE_CLOUD_PROJECT", "the-supernova-project")

    if not key:
        # PURE IDENTITY AUTH (2026 Sovereign Standard)
        _genai_client = genai.Client(vertexai=True, project=proj, location=location)
    else:
        # LEGACY KEY AUTH
        _genai_client = genai.Client(api_key=key)

def get_core_client():
    global _genai_client
    if _genai_client is None:
        initCoreAI()
    return _genai_client

class ResponseProxy:
    """Mimics the old SDK response object for backward compatibility."""
    def __init__(self, raw_res):
        self._raw = raw_res
        try:
            self.text = raw_res.candidates[0].content.parts[0].text
        except (AttributeError, IndexError):
            self.text = ""
        self.candidates = raw_res.candidates

class ModelProxy:
    """Mimics the old GenerativeModel behavior."""
    def __init__(self, client, model_name):
        self.client = client
        self.model_name = model_name

    def generate_content(self, prompt, **kwargs):
        res = self.client.models.generate_content(model=self.model_name, contents=prompt)
        return ResponseProxy(res)

    async def generate_content_async(self, prompt, **kwargs):
        # google-genai handles async differently, but we proxy for compatibility
        res = self.client.models.generate_content(model=self.model_name, contents=prompt)
        return ResponseProxy(res)

def get_core_model(model_tag: str = 'flash'):
    client = get_core_client()
    model_name = MODELS.get(model_tag, model_tag)
    return ModelProxy(client, model_name)

def generate_agentic_content(prompt, model_tag='flash', files=None):
    model = get_core_model(model_tag)
    return model.generate_content(prompt)

# Global Alias
generateAgenticContent = generate_agentic_content