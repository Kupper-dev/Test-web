import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const devlinkDir = path.join(__dirname, 'src', 'devlink');

if (!fs.existsSync(devlinkDir)) {
  console.error('DevLink directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(devlinkDir);
let patchedCount = 0;

files.forEach(file => {
  if (file.endsWith('.jsx') || file.endsWith('.js')) {
    const filePath = path.join(devlinkDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Regex matches style={"width: 100%; height: 100%;"} with flexible whitespace/semicolons
    const targetRegex = /style=\{"width:\s*100%;\s*height:\s*100%;?"\}/g;
    
    if (targetRegex.test(content)) {
      console.log(`Patching SVG style string in ${file}...`);
      content = content.replace(targetRegex, 'style={{ width: "100%", height: "100%" }}');
      fs.writeFileSync(filePath, content, 'utf8');
      patchedCount++;
    }
  }
});

// Patch BackgroundVideoWrapper for WebGL CORS access
const bgVideoPath = path.join(devlinkDir, 'webflow_modules', 'BackgroundVideo', 'components', 'BackgroundVideoWrapper.js');
if (fs.existsSync(bgVideoPath)) {
  let bgContent = fs.readFileSync(bgVideoPath, 'utf8');
  if (bgContent.includes('playsInline: true,') && !bgContent.includes('crossOrigin: "anonymous",')) {
    console.log('Patching BackgroundVideoWrapper.js for WebGL CORS support...');
    bgContent = bgContent.replace('playsInline: true,', 'playsInline: true,\n          crossOrigin: "anonymous",');
    fs.writeFileSync(bgVideoPath, bgContent, 'utf8');
    patchedCount++;
  }
}

console.log(`DevLink patch complete! Patched ${patchedCount} file(s).`);
