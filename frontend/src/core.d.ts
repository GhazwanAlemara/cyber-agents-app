declare module '@thecompany/core/db.js' {
    export function initCoreDB(firebaseConfig: any): any;
    export function getCoreDB(): any;
}
declare module '@thecompany/core/v2/ai.js' {
    export function generate(prompt: string, options?: any): Promise<string>;
}
