import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

let dbInstance = null;

/**
 * Initializes the Central Database Service.
 */
export const initCoreDB = (firebaseConfig) => {
    if (!firebaseConfig) throw new Error("[TheCore] Firebase config is required.");
    
    let app;
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApps()[0];
    }
    
    dbInstance = getFirestore(app);
    console.log("[TheCore] Database Systems Online.");
    return dbInstance;
};

export const getCoreDB = () => {
    if (!dbInstance) throw new Error("[TheCore] Call initCoreDB() before accessing the database.");
    return dbInstance;
};
