const fs = require('fs');
const path = require('path');

const moves = [
  ['src/lib/types.ts', 'src/types/global.types.ts'],
  ['src/translations/index.ts', 'src/lib/i18n/translations.ts'],
  ['src/utils/supabase/client.ts', 'src/lib/supabase/client.ts'],
  ['src/utils/supabase/server.ts', 'src/lib/supabase/server.ts'],
  ['src/utils/supabase/middleware.ts', 'src/lib/supabase/middleware.ts'],
  
  ['src/components/Navbar.tsx', 'src/components/layout/Navbar.tsx'],
  ['src/components/Footer.tsx', 'src/components/layout/Footer.tsx'],
  ['src/components/SVGSpinner.tsx', 'src/components/ui/SVGSpinner.tsx'],
  
  ['src/components/Hero.tsx', 'src/features/home/components/Hero.tsx'],
  ['src/components/About.tsx', 'src/features/about/components/About.tsx'],
  ['src/components/ProfileImage.tsx', 'src/features/about/components/ProfileImage.tsx'],
  
  ['src/components/Projects.tsx', 'src/features/projects/components/Projects.tsx'],
  ['src/components/ProjectsClient.tsx', 'src/features/projects/components/ProjectsClient.tsx'],
  
  ['src/components/Contact.tsx', 'src/features/contact/components/Contact.tsx'],
  
  ['src/app/globals.css', 'src/styles/globals.css'],
  
  // App Router moves
  ['src/app/page.tsx', 'src/app/(public)/page.tsx'],
  ['src/app/about', 'src/app/(public)/about'],
  ['src/app/projects', 'src/app/(public)/projects'],
  ['src/app/contact', 'src/app/(public)/contact'],
  ['src/app/admin', 'src/app/(admin)/admin']
];

for (const [src, dest] of moves) {
  if (fs.existsSync(src)) {
    const isDir = fs.lstatSync(src).isDirectory();
    const destDir = isDir ? path.dirname(dest) : path.dirname(dest);
    
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.renameSync(src, dest);
    console.log(`Moved ${src} to ${dest}`);
  } else {
    console.log(`Warning: ${src} not found`);
  }
}

// Generate barrel files
const indexFiles = {
  'src/components/layout/index.ts': "export { default as Navbar } from './Navbar';\nexport { default as Footer } from './Footer';\n",
  'src/components/ui/index.ts': "export { default as CustomCursor } from './CustomCursor';\nexport { default as PageTransition } from './PageTransition';\nexport { default as SmoothScroll } from './SmoothScroll';\nexport { default as SvgIcons } from './SvgIcons';\nexport { default as SVGSpinner } from './SVGSpinner';\n",
  'src/components/canvas/index.ts': "export { default as Canvas3D } from './Canvas3D';\nexport { default as Profile3D } from './Profile3D';\n",
  'src/features/home/components/index.ts': "export { default as Hero } from './Hero';\n",
  'src/features/about/components/index.ts': "export { default as About } from './About';\nexport { default as ProfileImage } from './ProfileImage';\n",
  'src/features/projects/components/index.ts': "export { default as Projects } from './Projects';\nexport { default as ProjectsClient } from './ProjectsClient';\n",
  'src/features/contact/components/index.ts': "export { default as Contact } from './Contact';\n",
  'src/lib/supabase/index.ts': "export * from './client';\nexport * from './server';\nexport * from './middleware';\n",
  'src/lib/i18n/index.ts': "export * from './translations';\n",
  'src/types/index.ts': "export * from './global.types';\n"
};

for (const [file, content] of Object.entries(indexFiles)) {
  fs.writeFileSync(file, content);
  console.log(`Created ${file}`);
}
