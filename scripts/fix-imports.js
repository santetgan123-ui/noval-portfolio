const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  { from: /['"]@\/components\/Navbar['"]/g, to: "'@/components/layout'" },
  { from: /['"]@\/components\/Footer['"]/g, to: "'@/components/layout'" },
  { from: /['"]@\/components\/Hero['"]/g, to: "'@/features/home/components'" },
  { from: /['"]@\/components\/About['"]/g, to: "'@/features/about/components'" },
  { from: /['"]@\/components\/ProfileImage['"]/g, to: "'@/features/about/components'" },
  { from: /['"]@\/components\/Projects['"]/g, to: "'@/features/projects/components'" },
  { from: /['"]@\/components\/ProjectsClient['"]/g, to: "'@/features/projects/components'" },
  { from: /['"]@\/components\/Contact['"]/g, to: "'@/features/contact/components'" },
  { from: /['"]@\/components\/SVGSpinner['"]/g, to: "'@/components/ui'" },
  { from: /['"]@\/components\/canvas\/Canvas3D['"]/g, to: "'@/components/canvas'" },
  { from: /['"]@\/components\/canvas\/Profile3D['"]/g, to: "'@/components/canvas'" },
  { from: /['"]@\/components\/ui\/(CustomCursor|PageTransition|SmoothScroll|SvgIcons)['"]/g, to: "'@/components/ui'" },
  { from: /['"]@\/lib\/types['"]/g, to: "'@/types'" },
  { from: /['"]@\/utils\/supabase\/(client|server|middleware)['"]/g, to: "'@/lib/supabase'" },
  { from: /['"]@\/translations['"]/g, to: "'@/lib/i18n'" },
  { from: /import ['"](\.\/|\.\.\/)*globals\.css['"]/g, to: "import '@/styles/globals.css'" }
];

walk('src', (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    for (const r of replacements) {
      if (r.from.test(content)) {
        content = content.replace(r.from, r.to);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed imports in', filePath);
    }
  }
});
