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

console.log('Resolved Rows:');
parsedExcel.forEach((row: any, i: number) => {
  const rowStr = Object.keys(row).map(k => `${k}: "${getVal(row[k])}"`).join(' | ');
  console.log(`Row ${i}: ${rowStr}`);
});
