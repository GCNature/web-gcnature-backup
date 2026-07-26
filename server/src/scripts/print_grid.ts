import * as fs from 'fs';
import * as path from 'path';

const jsonPath = path.resolve(__dirname, './parsed_policy.json');
const stringsPath = path.resolve(__dirname, './shared_strings.json');

const parsedExcel = JSON.parse(fs.readFileSync(jsonPath, 'utf8').charCodeAt(0) === 0xFEFF ? fs.readFileSync(jsonPath, 'utf8').substring(1) : fs.readFileSync(jsonPath, 'utf8'));
const sharedStrings: string[] = JSON.parse(fs.readFileSync(stringsPath, 'utf8').charCodeAt(0) === 0xFEFF ? fs.readFileSync(stringsPath, 'utf8').substring(1) : fs.readFileSync(stringsPath, 'utf8'));

const getVal = (val: any) => {
  if (val === undefined || val === null) return '';
  const parsedInt = parseInt(val);
  if (!isNaN(parsedInt) && parsedInt >= 0 && parsedInt < sharedStrings.length && String(parsedInt) === String(val)) {
    return sharedStrings[parsedInt];
  }
  return String(val);
};

// Group by row number
// In parsed_policy.json, rowData has columns A, B, C, D, E.
// Let's print row by row:
console.log('Grid representation:');
for (let i = 0; i < parsedExcel.length; i++) {
  const r = parsedExcel[i];
  const a = getVal(r.A);
  const b = getVal(r.B);
  const c = getVal(r.C);
  const d = getVal(r.D);
  const e = getVal(r.E);
  console.log(`Row ${i.toString().padStart(2, ' ')}: A: [${a}] | B: [${b}] | C: [${c}] | D: [${d}] | E: [${e}]`);
}
