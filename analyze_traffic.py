import os
from thecompany_core import init_core_firebase, get_core_firestore

def analyze_firestore():
    try:
        init_core_firebase()
        db = get_core_firestore()
        
        collections = ['users', 'github_events', 'threat_intel', 'agent_logs']
        stats = {}
        
        for coll_name in collections:
            docs = list(db.collection(coll_name).stream())
            stats[coll_name] = len(docs)
            
            # For threat_intel, let's see some details
            if coll_name == 'threat_intel' and len(docs) > 0:
                print(f"\n--- Recent Threats ---")
                for d in docs[:5]:
                    data = d.to_dict()
                    print(f"Reason: {data.get('reason')}, TS: {data.get('timestamp')}")

        print("\n--- Firestore Stats ---")
        for coll, count in stats.items():
            print(f"{coll}: {count} documents")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    analyze_firestore()
