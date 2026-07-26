const fs = require('fs');
const path = require('path');
const srcDir = 'C:\\Users\\mtien\\OneDrive\\Desktop\\web-mercy\\Product-20260407T075101Z-3-001\\Product';
const dstDir = path.join(__dirname, 'public', 'videos');
if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });

try {
  const files = fs.readdirSync(srcDir).filter(f => f.toLowerCase().endsWith('.mp4'));
  files.slice(0, 4).forEach((v, i) => {
     fs.copyFileSync(path.join(srcDir, v), path.join(dstDir, `review-\${i+1}.mp4`));
  });
  console.log('Successfully copied ' + files.slice(0, 4).length + ' MP4 review videos!');
} catch(e) {
  console.error(e);
}
