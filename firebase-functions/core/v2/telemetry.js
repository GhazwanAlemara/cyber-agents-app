import { doc, setDoc, serverTimestamp, increment } from "firebase/firestore";

/**
 * Unified Traffic Intelligence Protocol (JS/Node.js)
 * Standardized Fingerprinting to distinguish Humans, AI Agents, and Bot Scans.
 * Increments counters in the persistent 'imperial_stats' collection.
 */
export const trackRequest = async (db, req, projectId) => {
    try {
        const userAgent = (req.headers['user-agent'] || '').toLowerCase();
        const path = (req.url || '').toLowerCase();
        
        let category = 'human_visitors';
        
        // 1. Bot Scan Detection
        const isScan = [".env", "wp-admin", "wp-login", "config.php", "phpinfo.php"].some(probe => path.includes(probe));
        
        if (isScan) {
            category = 'vulnerability_scans';
        } else if (["bot", "agent", "crawler", "spider", "python", "curl", "wget"].some(k => userAgent.includes(k))) {
            // 2. AI Agent / Crawler Detection
            category = 'ai_agents';
        }

        const todayStr = new Date().toISOString().split('T')[0];
        const docId = `${projectId}_${todayStr}`;
        const docRef = doc(db, 'imperial_stats', docId);

        await setDoc(docRef, {
            project_id: projectId,
            date: todayStr,
            [category]: increment(1),
            last_updated: serverTimestamp()
        }, { merge: true });

        return category;
    } catch (e) {
        console.error(`[Telemetry] Error tracking request for ${projectId}:`, e);
        return null;
    }
};
