import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const tempDir = path.resolve(__dirname, './temp_xlsx');
  const sharedStringsPath = path.join(tempDir, 'xl/sharedStrings.xml');
  const sheetPath = path.join(tempDir, 'xl/worksheets/sheet1.xml');

  if (!fs.existsSync(sharedStringsPath) || !fs.existsSync(sheetPath)) {
    console.error('Extracted XML files not found.');
    return;
  }

  const stringsContent = fs.readFileSync(sharedStringsPath, 'utf8');
  const sharedStrings: string[] = [];
  const tMatches = stringsContent.matchAll(/<t.*?>(.*?)<\/t>/g);
  for (const m of tMatches) {
    sharedStrings.push(m[1]);
  }

  const sheetContent = fs.readFileSync(sheetPath, 'utf8');
  const grid: any = {};

  const cellRegex = /<c\s+([^>]*?)(?:\/>|>(.*?)<\/c>)/g;
  let match;
  while ((match = cellRegex.exec(sheetContent)) !== null) {
    const attrs = match[1];
    const inner = match[2] || '';

    const rMatch = attrs.match(/r="([A-Z]+)(\d+)"/);
    if (!rMatch) continue;
    const col = rMatch[1];
    const row = parseInt(rMatch[2]);

    const tMatch = attrs.match(/t="s"/);
    const isShared = !!tMatch;

    const vMatch = inner.match(/<v>(.*?)<\/v>/);
    const val = vMatch ? vMatch[1] : '';

    let realVal = '';
    if (isShared && val) {
      realVal = sharedStrings[parseInt(val)];
    } else {
      realVal = val;
    }

    if (!grid[row]) grid[row] = {};
    grid[row][col] = realVal;
  }

  // Find all columns
  const allCols = new Set<string>();
  Object.keys(grid).forEach(r => {
    Object.keys(grid[r]).forEach(c => allCols.add(c));
  });

  const sortedCols = Array.from(allCols).sort((a, b) => {
    if (a.length !== b.length) return a.length - b.length;
    return a.localeCompare(b);
  });

  const rows = Object.keys(grid).map(Number).sort((a, b) => a - b);

  let html = '<html><head><meta charset="utf-8"/><style>table{border-collapse:collapse;width:100%;}td,th{border:1px solid #ccc;padding:8px;font-size:12px;font-family:sans-serif;}th{background:#f4f4f4;}</style></head><body>';
  html += '<table><thead><tr><th>Row</th>';
  for (const col of sortedCols) {
    html += `<th>${col}</th>`;
  }
  html += '</tr></thead><tbody>';

  for (const r of rows) {
    html += `<tr><th>${r}</th>`;
    for (const col of sortedCols) {
      const val = grid[r][col] || '';
      html += `<td>${val}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table></body></html>';

  fs.writeFileSync(path.resolve(__dirname, './sheet_table.html'), html);
  console.log('HTML table written to sheet_table.html');
}

main();
