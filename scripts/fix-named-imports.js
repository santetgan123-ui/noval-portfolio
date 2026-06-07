const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('src', (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix default imports to named imports for the barrel files
    const regex = /import\s+([A-Z][a-zA-Z0-9_]*)\s+from\s+['"](@\/components\/layout|@\/components\/ui|@\/components\/canvas|@\/features\/[^'"]+)['"]/g;
    
    if (regex.test(content)) {
      content = content.replace(regex, "import { $1 } from '$2'");
      fs.writeFileSync(filePath, content);
      console.log('Fixed named imports in', filePath);
    }
  }
});
