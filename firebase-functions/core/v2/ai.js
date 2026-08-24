/**
 * THE CORE V2: AI SOVEREIGNTY ENGINE (ZERO-DEPENDENCY REST)
 * Direct REST implementation for maximum robustness in 2026.
 */
import { getIdentity } from "./auth.js";

const MODEL_REGISTRY = {
    "pro": "gemini-1.5-pro",
    "flash": "gemini-2.5-flash",
    "lite": "gemini-3.1-flash-lite", // The 2026 King of Efficiency
    "vision": "gemini-1.5-flash",
    "experimental": "gemini-2.0-flash-exp"
};

/**
 * World-Class Generate: Direct REST call to Vertex AI.
 */
export const generate = async (prompt, options = {}) => {
    const { projectId, location } = getIdentity();
    const modelTag = options.tag || "flash";
    const modelId = MODEL_REGISTRY[modelTag] || modelTag;
    
    // 2026 REST Endpoint Pattern
    const endpoint = `https://aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:generateContent`;
    
    console.log(`[TheCore/AI] Calling Imperial Model: ${modelId} (${location})`);

    const payload = {
        contents: [{
            role: "user",
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 2048
        }
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GCLOUD_TOKEN || await getGcloudToken()}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`[TheCore/AI] Imperial Pulse Failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // 2026 Extraction Pattern
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
        return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error("[TheCore/AI] Extraction Protocol Failed: Malformed Response.");
};

/**
 * Helper to get gcloud token if not provided.
 */
async function getGcloudToken() {
    // In a world-class system, we'd use the service account, 
    // but for the CLI, we pull the active gcloud token.
    return new Promise((resolve, reject) => {
        import('child_process').then(cp => {
            cp.exec('gcloud auth print-access-token', (err, stdout) => {
                if (err) reject(err);
                resolve(stdout.trim());
            });
        });
    });
}
