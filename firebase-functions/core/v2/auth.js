/**
 * THE CORE V2: IDENTITY & AUTHENTICATION
 * Handles the "Identity is the only Key" mandate.
 */

export const getIdentity = () => {
    const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.FB_PROJECT_ID || 'cyber-agents-app';
    return {
        projectId: project,
        location: process.env.GOOGLE_CLOUD_LOCATION || 'global',
        serviceAccount: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'Master-Identity'
    };
};

export const getSecret = async (secretName) => {
    const { projectId } = getIdentity();
    const url = `https://secretmanager.googleapis.com/v1/projects/${projectId}/secrets/${secretName}/versions/latest:access`;
    
    // In Cloud Functions, we use the local environment token or fetch one
    const token = process.env.GCLOUD_TOKEN || await getGcloudToken();
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        // Fallback to environment variables if Secret Manager fails
        console.warn(`[TheCore/Auth] Secret ${secretName} not found in Vault. Falling back to ENV.`);
        return process.env[secretName];
    }

    const data = await response.json();
    const payload = Buffer.from(data.payload.data, 'base64').toString('utf-8');
    return payload;
};

async function getGcloudToken() {
    // Attempt to fetch from metadata server
    try {
        const response = await fetch("http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token", {
            headers: { "Metadata-Flavor": "Google" }
        });
        if (response.ok) {
            const data = await response.json();
            return data.access_token;
        }
    } catch (e) {
        // Local fallback
        return new Promise((resolve, reject) => {
            import('child_process').then(cp => {
                cp.exec('gcloud auth print-access-token', (err, stdout) => {
                    if (err) resolve(null);
                    resolve(stdout.trim());
                });
            });
        });
    }
    return null;
}
