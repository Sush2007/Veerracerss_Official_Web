import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const defaultsContent = fs.readFileSync('src/data/cms_defaults.ts', 'utf-8');

// Find all strings starting with / inside quotes with an extension
const matches = [...defaultsContent.matchAll(/['"](\/[a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)['"]/g)];
const paths = [...new Set(matches.map(m => m[1]))];

console.log(`[Asset Guard] Auditing ${paths.length} static asset references in defaults...`);
const missing = [];
for (const p of paths) {
  // Ignore external / non-public links or API routes
  if (p.startsWith('/api/')) continue;
  const localFile = path.join(publicDir, p.replace(/^\//, '').replace(/\//g, path.sep));
  if (!fs.existsSync(localFile)) {
    missing.push({ path: p, expectedDiskPath: localFile });
  }
}

if (missing.length > 0) {
  console.error('\n❌ [Asset Guard Failure] Found missing static files in public directory:');
  for (const m of missing) {
    console.error(` - Reference: ${m.path} -> Missing on disk at: ${m.expectedDiskPath}`);
  }
  console.error('\nPlease add the missing assets or fix the path in cms_defaults.ts before building.\n');
  process.exit(1);
} else {
  console.log(`✅ [Asset Guard] All ${paths.length} static asset paths verified on disk!\n`);
}
