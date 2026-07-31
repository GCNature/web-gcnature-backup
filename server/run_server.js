const { spawn } = require('child_process');
const path = require('path');

const tsxCmd = `"${path.resolve(__dirname, 'node_modules/.bin/tsx.cmd')}"`;
const scriptPath = `"${path.resolve(__dirname, 'src/index.ts')}"`;

console.log('Starting GCnature backend with tsx:', tsxCmd);

const child = spawn(tsxCmd, [scriptPath], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  console.log('Backend process exited with code:', code);
  process.exit(code || 0);
});
