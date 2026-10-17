export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  credentials: string;
  avatar: string;
}

export const AUTHORS: Author[] = [
  {
    id: "marcus-thorne",
    name: "Marcus Thorne",
    role: "Principal AI Security Researcher & MCP Protocol Lead",
    bio: "Marcus Thorne leads research on Model Context Protocol (MCP) toolchain isolation, prompt injection interception, and autonomous agent runtime authorization architectures at CyberAgents.",
    credentials: "M.S. in Cybersecurity, Former Red Team Lead, OWASP LLM Contributor",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400"
  },
  {
    id: "elena-rostova",
    name: "Dr. Elena Rostova",
    role: "Autonomous Agent Red Teamer & LLM Exploit Analyst",
    bio: "Dr. Elena Rostova specializes in adversarial vulnerability research, multi-turn jailbreak detection, and automated security assurance pipelines for agentic swarms.",
    credentials: "Ph.D. in Computer Science (Adversarial AI), DefCon Speaker",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400"
  },
  {
    id: "nathan-chen",
    name: "Nathan Chen, CISSP",
    role: "Enterprise AI Defense Architect & Cloud Sandboxing Lead",
    bio: "Nathan Chen designs zero-trust execution sandboxes, real-time threat telemetry models, and NIST AI RMF compliance enforcement systems for enterprise AI deployments.",
    credentials: "CISSP, CISM, Cloud Security Alliance Fellow",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400"
  }
];

export function getAuthorForSlug(slug: string): Author {
  if (!slug) return AUTHORS[0];
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return AUTHORS[Math.abs(hash) % AUTHORS.length];
}
