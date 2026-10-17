import os
import logging
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)
_genai_client = None

# 2026 Sovereign Model Fleet - Unified Standard
MODELS = {
    "lite": "gemini-3.1-flash-lite",
    "flash": "gemini-3.8-flash",
    "vision": "gemini-3.8-flash",
    "pro": "gemini-3.8-flash",
    "audit": "gemini-4-argon",
    "pro_exp": "gemini-4-argon",
    "flash_exp": "gemini-3.1-flash-lite",
    "video": "gemini-3.8-flash",
    "audio": "gemini-3.8-flash",
    "computer": "gemini-4-argon",
    "image": "imagen-3"
}

def initCoreAI(api_key: str = None, project: str = None, location: str = None):
    """
    Initializes the Unified GenAI Client.
    V2 MANDATE: Defaults to Identity-based Auth (Vertex AI).
    API Key is ONLY used if explicitly provided as an argument.
    """
    global _genai_client
    
    # We ignore os.getenv("GEMINI_API_KEY") to prevent hijacking identity auth
    key = api_key 
    proj = project or os.getenv("GOOGLE_CLOUD_PROJECT", "the-supernova-project")
    loc = location or os.getenv("GOOGLE_CLOUD_LOCATION") or "global"

    if not key:
        # PURE IDENTITY AUTH (2026 Sovereign Standard)
        _genai_client = genai.Client(vertexai=True, project=proj, location=loc)
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
        self.text = ""
        try:
            for part in raw_res.candidates[0].content.parts:
                if hasattr(part, 'text') and part.text:
                    self.text = part.text
                    break
        except (AttributeError, IndexError, TypeError):
            pass
        self.candidates = getattr(raw_res, 'candidates', [])

class ModelProxy:
    """Mimics the old GenerativeModel behavior."""
    def __init__(self, client, model_name):
        self.client = client
        self.model_name = model_name

    def generate_content(self, prompt, **kwargs):
        res = self.client.models.generate_content(model=self.model_name, contents=prompt)
        return ResponseProxy(res)

    async def generate_content_async(self, prompt, **kwargs):
        res = await self.client.aio.models.generate_content(model=self.model_name, contents=prompt)
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
