const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\mtien\\OneDrive\\Desktop\\web-mercy\\Product-20260407T075101Z-3-001\\Product\\Ảnh bìa sự kiện-8-3';
const dstDir = path.join(__dirname, 'public', 'banners');

if (!fs.existsSync(dstDir)) {
  fs.mkdirSync(dstDir, { recursive: true });
}

try {
  fs.copyFileSync(path.join(srcDir, 'MCK5.1Đôi.png'), path.join(dstDir, 'MCK5.1-banner.png'));
  fs.copyFileSync(path.join(srcDir, 'MCK5.0Đôi.png'), path.join(dstDir, 'MCK5.0-banner.png'));
  fs.copyFileSync(path.join(srcDir, 'POV5.1D.png'), path.join(dstDir, 'POV5.1-banner.png'));
  fs.copyFileSync(path.join(srcDir, 'KDT5.0D.png'), path.join(dstDir, 'KDT5.0-banner.png'));
  console.log("Success! Copied 5.0 and 5.1 banners.");
} catch (e) {
  console.error("Error copying banners:", e);
}
