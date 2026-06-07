const fs = require('fs');

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
  console.log('Created ' + file);
}
