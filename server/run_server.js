const { spawn } = require('child_process');
const path = require('path');

const nodeExe = process.execPath;
const tsxCli = path.resolve(__dirname, 'node_modules/tsx/dist/cli.mjs');
const scriptPath = path.resolve(__dirname, 'src/index.ts');

console.log('Starting GCnature backend directly with node + tsx cli:', nodeExe, tsxCli, scriptPath);

const child = spawn(nodeExe, [tsxCli, scriptPath], {
  cwd: __dirname,
  stdio: 'inherit',
  env: process.env
});

child.on('exit', (code) => {
  console.log('Backend process exited with code:', code);
  process.exit(code || 0);
});
