import datetime
import logging
from google.cloud import firestore
from .db import get_core_firestore

logger = logging.getLogger(__name__)

def get_category(user_agent: str, path: str) -> str:
    user_agent = user_agent.lower()
    path = path.lower()
    
    is_scan = False
    for probe in [".env", "wp-admin", "wp-login", "config.php", "phpinfo.php"]:
        if probe in path:
            is_scan = True
            break
            
    if is_scan:
        return "vulnerability_scans"
    elif any(k in user_agent for k in ["bot", "agent", "crawler", "spider", "python", "curl", "wget"]):
        return "ai_agents"
    else:
        return "human_visitors"

def track_request(request, project_id: str):
    """
    Unified Traffic Intelligence Protocol.
    Standardized Fingerprinting to distinguish Humans, AI Agents, and Bot Scans.
    Increments counters in the persistent 'imperial_stats' collection.
    """
    try:
        db = get_core_firestore()
    except Exception as e:
        try:
            from .db import initCoreDB
            initCoreDB()
            db = get_core_firestore()
        except Exception as init_err:
            logger.error(f"[Telemetry] Firestore not initialized: {e} | Auto-init failed: {init_err}")
            return

    # Extract info safely to support multiple frameworks (FastAPI/Flask/etc.)
    headers = getattr(request, "headers", {})
    user_agent = ""
    if isinstance(headers, dict):
        user_agent = headers.get("user-agent", "")
    elif hasattr(headers, "get"):
        user_agent = headers.get("user-agent", "")

    path = ""
    if hasattr(request, "url") and hasattr(request.url, "path"):
        path = request.url.path # FastAPI
    elif hasattr(request, "path"):
        path = request.path # Flask / Django
    
    category = get_category(user_agent, path)

    # Persistent Firestore Sink
    today_str = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")
    
    # Global imperial_stats shared across projects
    doc_ref = db.collection("imperial_stats").document(f"{project_id}_{today_str}")
    
    try:
        doc_ref.set({
            "project_id": project_id,
            "date": today_str,
            category: firestore.Increment(1),
            "last_updated": firestore.SERVER_TIMESTAMP
        }, merge=True)
        return category
    except Exception as e:
        logger.error(f"[Telemetry] Error updating imperial_stats: {e}")
        return None
