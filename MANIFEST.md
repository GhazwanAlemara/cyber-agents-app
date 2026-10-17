# Ã°Å¸â€ºÂ¡Ã¯Â¸Â PROJECT MANIFEST: Cyber-Agents

## Identity
- **PROJECT_ID:** cyber-agents-app
- **GCP Project ID:** `cyber-agents-app`
- GCP_IDENTITY: cyber-agents-app
- **Project Name:** Cyber-Agents (AI Agent Security Platform)
- **Sovereignty Level:** V3_ARMED
- **Deployment Region:** `us-central1` (Cloud Run & Functions)
- **Base URL:** `https://cyberagents.app`

## Architecture
- **Frontend:** Vite 8 + React 19 + TypeScript (Tailwind-free, Vanilla CSS) + Knowledge Hub / Blog System.
- **Backend (Functions):** Node.js 20 (Firebase Functions) - Orchestration, Webhooks, Stripe.
- **Backend (AI Engine):** Python 3.11 + FastAPI (Cloud Run) - Real-time security analysis.
- **Database:** Firestore (Collections: `github_events`, `threat_intel`, `users`, `brands`, `mcp_telemetry`, `a2a_telemetry`).
- **Core Library:** `@thecompany/core` (Linked to Imperial Core v2).

## Core Logic Map
- **Agent Behavior Logging:** Immutable audit trails for tool calls and data access.
- **Prompt Injection Detection:** Real-time analysis of inputs flowing into autonomous agents.
- **Permission Enforcement:** Scoped tool access and data boundaries at the MCP layer (Native `/validate-mcp` AI endpoint).
- **A2A Trust Scoring:** Validation of claims and permissions in Agent-to-Agent interactions (Native `/a2a-score` AI endpoint).
- **Knowledge Hub Reader:** Dynamic SEO blog engine fetching published articles index and payload from GCS bucket (gs://cyberagents-seo-assets).
- **Ghost-Mirror:** Virtualized environment via `core link` to preserve G: drive integrity and NVMe speed.

## Imperial Battle Test
- **File:** `imperial_battle_test.js`
- **Coverage:**
  - Frontend Pulse: Health check of Firebase Hosting.
  - AI Engine Identity: Assertion of GCP Project ID and service health.
  - Security Logic: Validation of the Prompt Injection Detection engine.
- **Execution:** `node imperial_battle_test.js`

## Sovereign Mandates
- **Zero-Key Sovereignty:** All secrets MUST be fetched via GCP Secret Manager; no `.env` files in production.
- **Reproduction-First:** No bug fixes without an isolated reproduction script or `curl` validation.
- **Core Integrity:** Vassals are forbidden from modifying core library internals without approval.
- **Validation Matrix:** Logic changes (Tier 2) require a successful `core audit` and `imperial_battle_test`.

## Ã°Å¸â€œÅ“ Expedition Log

- **2026-10-17:** Production Deployment & Supernova Shield Integration. Deployed Logo 3 (`CyberAgents [The Supernova Shield]`) with cropped horizontal wordmark (`logo-v3.png`, `logo.png`) and square favicon (`favicon.png`). Implemented bi-directional ecosystem linking between `cyberagents.app` and `supernova.cool` (Supernova navigation button, drawer link, AEGIS trust banner, and CyberAgents hero badge/footer directory). Conformed model registries to the 3-Tier Sovereign Model Fleet across the AI engine and Firebase Functions. Rebuilt via Shadow Forge (123 prerendered articles, 127 sitemap URLs), passed 100% Imperial Battle Test, deployed to Firebase Hosting, purged Cloudflare edge cache across 300+ PoPs, and certified via live 8-point production verification suite.

- **2026-10-16:** Executed DataCastle-Style In-Article PLG & Multi-Provider Auth Overhaul. Implemented `AgentSecurityWidget` embedding a live prompt injection & MCP tool security scanner at the 30% midpoint of all 123 pre-rendered articles and homepage. Added anonymous trial limits (3 scans) with post-auth session state preservation, downloadable Certified PDF Audit reports, and high-intent in-article conversion banners. Built `AuthModal` integrating Google Auth, GitHub OAuth, and direct Email/Password sign-in (enabled `signIn.email` in Identity Toolkit). Built cleanly via Shadow Forge and passed 100% Imperial Battle Test.


- **2026-09-19:** Connected Contact form to support@cyberagents.app via FormSubmit AJAX background dispatch and pre-filled mailto client trigger with interactive feedback and fallback email button. Built via Shadow Forge, passed Imperial Battle Test, and deployed to Firebase Hosting via Gatekeeper.


- **2026-09-19:** Trailing Slash Canonical & Sitemap Synchronization. Updated `frontend/prerender.js` to enforce trailing slashes across all 123 article canonical URLs (`https://cyberagents.app/blog/:slug/`), schema `@id` tags, and XML sitemaps to prevent 301 canonical redirect conflicts with Firebase Hosting static folder serving. Prerendered and deployed to Firebase Hosting.


- **2026-09-19:** Executed Imperial SEO & GEO Architecture Transformation. Resolved Google crawler client-side rendering invisibility by building an SSG prerender pipeline (`prerender.js`) generating static HTML for all 123 articles, knowledge hub, docs, and contact. Injected verifiable E-E-A-T Person structured schemas (Marcus Thorne, Dr. Elena Rostova, Nathan Chen CISSP) with author bios and avatars. Deployed dedicated `/contact` page routed and linked in landing footer. Generated comprehensive 127-URL `sitemap.xml`. Verified via 100% Imperial Battle Test and deployed to Firebase Hosting with live HTTP validation.


- **2026-09-11:** Executed 100% Comprehensive Deep Audit & Responsive UI Overhaul. Resolved multi-tenant isolation vulnerabilities on Firestore collections by strictly filtering by userId/hostId on Dashboard.tsx, ai-engine, and firebase-functions. Deployed composite indexes via firestore.indexes.json. Re-architected mobile navigation with an animated hamburger drawer (clean text labels, zero emojis), responsive documentation page (`frontend/src/components/Docs.tsx`) with semantic CSS classes and interactive smooth-scrolling TOC, and responsive Blog pagination with mobile-friendly sliding window (3 visible pages on mobile, arrow controls). Passed 100% Imperial Battle Test and deployed to production.

## ## Operational Commands (Imperial CLI)
- **Ã°Å¸Â§Â  AI Core (Antigravity):**
  - `agy -r <ID>` (Resumes global sessions securely via Sentinel Auto-Checkpointing)
  - `gemini-sessions` (Retrieves global index map across the Empire)
