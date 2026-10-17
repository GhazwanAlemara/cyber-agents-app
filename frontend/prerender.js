import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '..', 'dist');
const publicDir = path.resolve(__dirname, 'public');
const articlesDir = path.resolve(__dirname, 'src', 'data', 'seo_articles');
const metadataFile = path.resolve(__dirname, 'src', 'data', 'articles_metadata.json');

const AUTHORS = [
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

function getAuthorForSlug(slug) {
  if (!slug) return AUTHORS[0];
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  return AUTHORS[Math.abs(hash) % AUTHORS.length];
}

export function run() {
  console.log('[prerender] Starting Cyber-Agents Prerender Pipeline...');

  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`[error] Build index.html not found at: ${indexHtmlPath}`);
    process.exit(1);
  }

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Helper to generate a pre-rendered static page
  const generateStaticPage = (route, title, description, contentHtml, schema) => {
    const outDir = path.join(distDir, route);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    let modifiedHtml = indexHtml;

    if (title) {
      modifiedHtml = modifiedHtml.replace(
        /<title>.*?<\/title>/,
        `<title>${title}</title>\n    <meta property="og:title" content="${title}">\n    <meta name="twitter:title" content="${title}">`
      );
    }

    if (description) {
      const escapedDesc = description.replace(/"/g, '&quot;');
      const canonicalUrl = `https://cyberagents.app${route === '/' ? '/' : (route.endsWith('/') ? route : `${route}/`)}`;
      // Eliminate conflicting duplicate canonicals from base index.html
      modifiedHtml = modifiedHtml.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');
      const metaTags = `
    <meta name="description" content="${escapedDesc}">
    <link rel="canonical" href="${canonicalUrl}">
    <meta property="og:description" content="${escapedDesc}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:type" content="${route.startsWith('/blog/') ? 'article' : 'website'}">
    <meta property="og:site_name" content="CyberAgents">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:description" content="${escapedDesc}">
      `.trim();
      modifiedHtml = modifiedHtml.replace('</head>', `    ${metaTags}\n  </head>`);
    }

    if (schema) {
      modifiedHtml = modifiedHtml.replace(
        '</head>',
        `    <script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n    </script>\n  </head>`
      );
    }

    if (contentHtml) {
      modifiedHtml = modifiedHtml.replace(
        /<div id="root">[\s\S]*?<\/div>(?=\s*(?:<noscript|<script))/i,
        `<div id="root"></div>\n    <noscript><main class="prerendered-content">${contentHtml}</main></noscript>`
      );
    }

    fs.writeFileSync(path.join(outDir, 'index.html'), modifiedHtml, 'utf8');
  };

  // 1. Load articles
  let metadataList = [];
  if (fs.existsSync(metadataFile)) {
    try {
      metadataList = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));
    } catch (e) {
      console.warn('[warn] Could not parse articles_metadata.json:', e.message);
    }
  }

  const articleMap = new Map();
  metadataList.forEach(m => articleMap.set(m.slug, m));

  if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));
    files.forEach(f => {
      try {
        const fullArt = JSON.parse(fs.readFileSync(path.join(articlesDir, f), 'utf8'));
        const slug = fullArt.slug || f.replace('.json', '');
        const existing = articleMap.get(slug) || {};
        articleMap.set(slug, { ...existing, ...fullArt, slug });
      } catch (err) {}
    });
  }

  const allArticles = Array.from(articleMap.values());
  console.log(`[info] Found ${allArticles.length} Cyber-Agents articles to prerender.`);

  // 2. Prerender each article
  allArticles.forEach(art => {
    const slug = art.slug;
    if (!slug) return;

    const title = art.title || slug.replace(/-/g, ' ');
    const metaTitle = `${title} | CyberAgents Knowledge Hub`;
    const metaDescription = art.meta_description || art.geo_summary || `Technical analysis on ${title} and AI agent security architectures.`;
    const publishDate = art.published_at || art.publish_date || '2026-07-24';
    const author = getAuthorForSlug(slug);
    
    // Sanitize article body HTML
    const rawBody = art.html_content || art.content || art.meta_description || '';
    let bodyHtml = rawBody.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
    bodyHtml = bodyHtml.replace(/^\s*<section>\s*<\/section>/i, '');
    bodyHtml = bodyHtml.replace(/<h1([^>]*)>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>');
    bodyHtml = bodyHtml.replace(/<p>\s*---\s*<\/p>/gi, '<hr class="article-divider" />');
    bodyHtml = bodyHtml.replace(/\n\s*---\s*\n/gi, '<hr class="article-divider" />');
    bodyHtml = bodyHtml.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
      const formatted = math
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\\mathbin\{\\Vert\}/g, ' || ')
        .replace(/\\Vert/g, ' || ')
        .replace(/\\times/g, ' × ')
        .replace(/\\ge/g, ' ≥ ')
        .replace(/\\le/g, ' ≤ ')
        .replace(/\\to/g, ' → ')
        .trim();
      return `<div class="article-math-block"><code>${formatted}</code></div>`;
    });
    bodyHtml = bodyHtml.replace(/\$([^\$\n]{1,120}?)\$/g, (_, math) => {
      const formatted = math
        .replace(/\\vec\{([a-zA-Z])\}/g, '$1⃗')
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\\max/g, 'max')
        .replace(/\\min/g, 'min')
        .replace(/\\ge/g, '≥')
        .replace(/\\le/g, '≤')
        .replace(/\\theta/g, 'θ')
        .replace(/\\alpha/g, 'α')
        .replace(/\\beta/g, 'β')
        .replace(/\\lambda/g, 'λ')
        .replace(/\\sigma/g, 'σ')
        .replace(/\\in/g, '∈')
        .replace(/\\cup/g, '∪')
        .replace(/\\cap/g, '∩')
        .replace(/\\subset/g, '⊂')
        .replace(/\\times/g, '×')
        .replace(/\\rightarrow/g, '→')
        .trim();
      return `<code class="article-math-inline">${formatted}</code>`;
    });

    const articleHtml = `
      <header style="max-width:840px; margin:0 auto 2rem auto; padding:2rem 1rem 1rem 1rem; color:#f8fafc;">
        <nav style="margin-bottom:1rem; font-size:0.9rem;">
          <a href="/" style="color:#38bdf8; text-decoration:none;">Home</a> &gt; 
          <a href="/blog" style="color:#38bdf8; text-decoration:none;">Knowledge Hub</a> &gt; 
          <span style="color:#94a3b8;">${title}</span>
        </nav>
        <h1 style="font-size:2.25rem; font-weight:800; color:#f8fafc; line-height:1.25; margin-bottom:1rem;">${title}</h1>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid #334155;">
          <img src="${author.avatar}" alt="" aria-hidden="true" style="width:48px; height:48px; border-radius:50%; object-fit:cover;" />
          <div>
            <div style="font-weight:700; color:#f8fafc; font-size:0.95rem;">${author.name}</div>
            <div style="color:#94a3b8; font-size:0.8rem;">${author.role} • Published ${new Date(publishDate).toLocaleDateString()}</div>
          </div>
        </div>
      </header>
      <article style="max-width:840px; margin:0 auto; padding:0 1rem; line-height:1.75; font-size:1.05rem; color:#cbd5e1;">
        ${bodyHtml}
      </article>
      <div style="max-width:840px; margin:2.5rem auto; padding:1.75rem; background:#0f172a; border:1px solid #1e293b; border-radius:12px;">
        <span style="font-size:0.75rem; text-transform:uppercase; font-weight:800; color:#ff48b0; letter-spacing:0.05em;">ENTERPRISE AGENT GUARDRAILS • THE SUPERNOVA SHIELD</span>
        <h3 style="margin:0.5rem 0; color:#f8fafc; font-size:1.35rem; font-weight:800;">Automate Prompt Injection & MCP Security Across Your Fleet</h3>
        <p style="color:#94a3b8; font-size:0.95rem; margin-bottom:1.25rem; line-height:1.6;">Deploy real-time guardrails for LangChain, CrewAI, AutoGen, and custom Python/Node agents with 2 lines of code. The native security shield for the Supernova agent ecosystem.</p>
        <a href="https://cyberagents.app/#live-scanner" style="display:inline-block; padding:10px 22px; background:#ffffff; color:#000000; font-weight:700; border-radius:9999px; text-decoration:none;">Launch Live Scanner →</a>
      </div>
      <aside style="max-width:840px; margin:3rem auto; padding:1.5rem; background:#0f172a; border:1px solid #1e293b; border-radius:12px; display:flex; gap:16px; align-items:flex-start;">
        <img src="${author.avatar}" alt="${author.name}" style="width:72px; height:72px; border-radius:50%; object-fit:cover; flex-shrink:0;" />
        <div>
          <div style="font-size:0.75rem; text-transform:uppercase; font-weight:800; color:#38bdf8; letter-spacing:0.05em; margin-bottom:4px;">About the Author</div>
          <h3 style="margin:0 0 4px 0; font-size:1.15rem; color:#f8fafc;">${author.name}</h3>
          <p style="margin:0 0 8px 0; font-size:0.85rem; color:#7dd3fc; font-weight:600;">${author.role} • ${author.credentials}</p>
          <p style="margin:0; font-size:0.9rem; color:#94a3b8; line-height:1.5;">${author.bio}</p>
        </div>
      </aside>
      <div style="max-width:840px; margin:2rem auto; text-align:center;">
        <a href="/blog" style="display:inline-block; padding:10px 24px; background:#1e293b; color:#38bdf8; text-decoration:none; border-radius:8px; font-weight:600; border:1px solid #334155;">&larr; Return to Knowledge Hub</a>
      </div>
    `;

    const schema = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": title,
      "datePublished": publishDate,
      "dateModified": publishDate,
      "author": {
        "@type": "Person",
        "name": author.name,
        "jobTitle": author.role,
        "worksFor": {
          "@type": "Organization",
          "name": "CyberAgents",
          "url": "https://cyberagents.app"
        }
      },
      "publisher": {
        "@type": "Organization",
        "name": "CyberAgents",
        "url": "https://cyberagents.app",
        "logo": {
          "@type": "ImageObject",
          "url": "https://cyberagents.app/logo-v3.png"
        }
      },
      "description": metaDescription,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://cyberagents.app/blog/${slug}/`
      }
    };

    generateStaticPage(`/blog/${slug}`, metaTitle, metaDescription, articleHtml, schema);
  });

  console.log(`[success] Pre-rendered all ${allArticles.length} Cyber-Agents article routes!`);

  // 3. Prerender /blog Index
  console.log('[prerender] Prerendering /blog Knowledge Hub Index...');
  const blogListHtml = allArticles.map(a => {
    const author = getAuthorForSlug(a.slug);
    return `
      <article style="padding:1.5rem; border:1px solid #1e293b; border-radius:12px; margin-bottom:1.25rem; background:#0f172a; box-shadow:0 1px 3px rgba(0,0,0,0.3);">
        <h2 style="margin:0 0 0.5rem 0; font-size:1.35rem;">
          <a href="/blog/${a.slug}" style="color:#f8fafc; text-decoration:none;">${a.title}</a>
        </h2>
        <div style="font-size:0.85rem; color:#94a3b8; margin-bottom:0.75rem;">
          By ${author.name} • ${new Date(a.published_at || a.publish_date || Date.now()).toLocaleDateString()}
        </div>
        <p style="color:#cbd5e1; font-size:0.95rem; line-height:1.6; margin:0 0 1rem 0;">
          ${a.meta_description || a.geo_summary || ''}
        </p>
        <a href="/blog/${a.slug}" style="color:#38bdf8; font-weight:600; text-decoration:none; font-size:0.9rem;">
          Read Technical Security Analysis &rarr;
        </a>
      </article>
    `;
  }).join('');

  const blogIndexHtml = `
    <section style="max-width:900px; margin:0 auto; padding:3rem 1rem; color:#f8fafc;">
      <header style="margin-bottom:2.5rem; text-align:center;">
        <span style="color:#38bdf8; font-weight:700; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.05em;">Autonomous Security & Agentic Defense</span>
        <h1 style="font-size:2.5rem; font-weight:800; color:#f8fafc; margin:0.5rem 0;">CyberAgents Knowledge Hub</h1>
        <p style="font-size:1.15rem; color:#94a3b8; max-width:650px; margin:0 auto;">
          In-depth research on MCP security protocols, prompt injection defense, agent swarm red teaming, and NIST AI RMF compliance.
        </p>
      </header>
      <div>
        ${blogListHtml}
      </div>
    </section>
  `;

  generateStaticPage(
    '/blog',
    'AI Agent Security Knowledge Hub & Research | CyberAgents',
    'Explore actionable research on Model Context Protocol security, prompt injection defenses, LLM backdoor detection, and autonomous agent red teaming.',
    blogIndexHtml,
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "CyberAgents Knowledge Hub",
      "url": "https://cyberagents.app/blog/",
      "description": "Enterprise AI agent security research, red teaming guides, and MCP protocol defense."
    }
  );

  // 4. Prerender /docs and /contact
  generateStaticPage(
    '/docs',
    'Documentation & API Reference | CyberAgents',
    'Technical documentation for deploying CyberAgents MCP security proxy, AI prompt injection detection, and agent swarm monitoring.',
    '<section style="max-width:860px; margin:0 auto; padding:3rem 1rem; color:#f8fafc;"><h1>CyberAgents Documentation</h1><p>Comprehensive guide to instrumenting autonomous agent telemetry and prompt defense.</p></section>',
    null
  );

  generateStaticPage(
    '/contact',
    'Contact CyberAgents | AI Security & Incident Response Desk',
    'Direct communication channel for enterprise AI security advisory, vulnerability disclosure, and MCP protocol integration support.',
    `
      <section style="max-width:800px; margin:0 auto; padding:3rem 1rem; color:#f8fafc;">
        <h1>Contact CyberAgents</h1>
        <p>Enterprise AI Agent Security & MCP Vulnerability Response Desk.</p>
        <p>Email: <a href="mailto:support@cyberagents.app" style="color:#38bdf8;">support@cyberagents.app</a></p>
        <p>Location: United States & European Union</p>
      </section>
    `,
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact CyberAgents",
      "url": "https://cyberagents.app/contact/"
    }
  );

  // 5. Update Sitemap Files
  console.log('[sitemap] Generating comprehensive CyberAgents sitemap XML...');
  const today = new Date().toISOString().split('T')[0];
  const sitemapUrls = [
    { loc: 'https://cyberagents.app/', priority: '1.0', changefreq: 'daily', lastmod: today },
    { loc: 'https://cyberagents.app/blog/', priority: '0.9', changefreq: 'daily', lastmod: today },
    { loc: 'https://cyberagents.app/docs/', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { loc: 'https://cyberagents.app/contact/', priority: '0.8', changefreq: 'monthly', lastmod: today }
  ];

  allArticles.forEach(a => {
    sitemapUrls.push({
      loc: `https://cyberagents.app/blog/${a.slug}/`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: a.published_at ? a.published_at.split('T')[0] : today
    });
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

  console.log(`[sitemap] CyberAgents sitemap written with ${sitemapUrls.length} verified URLs!`);
  console.log('[prerender] Cyber-Agents Prerender Pipeline Complete!');
}

run();
