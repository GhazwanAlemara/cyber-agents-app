import firebase_admin
from firebase_admin import credentials, firestore, db
import logging

logger = logging.getLogger(__name__)

_firebase_app = None
_firestore_db = None
_rtdb_ref = None

def initCoreDB(database_url: str = None, cred_path: str = None, cert_dict: dict = None):
    global _firebase_app, _firestore_db, _rtdb_ref
    
    if not firebase_admin._apps:
        if cred_path or cert_dict:
            cred = credentials.Certificate(cred_path if cred_path else cert_dict)
            _firebase_app = firebase_admin.initialize_app(cred, {'databaseURL': database_url})
        else:
            _firebase_app = firebase_admin.initialize_app(options={'databaseURL': database_url})
    else:
        _firebase_app = firebase_admin.get_app()

    _firestore_db = firestore.client()
    if database_url:
        _rtdb_ref = db.reference()
        logger.info(f'[TheCore] Pure Google DB Systems Online (Firestore + RTDB @ {database_url})')
    else:
        logger.info('[TheCore] Pure Google DB Systems Online (Firestore Only)')

def get_core_firestore():
    if not _firestore_db:
        raise RuntimeError('[TheCore] Call initCoreDB() before accessing Firestore.')
    return _firestore_db

def get_core_rtdb():
    if not _rtdb_ref:
        raise RuntimeError('[TheCore] Call initCoreDB(database_url=...) before accessing Realtime DB.')
    return _rtdb_ref

