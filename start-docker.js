const { exec } = require('child_process');

function runCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    const process = exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        console.error(`Stderr: ${stderr}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(`Stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

async function startDocker() {
  try {
    console.log('Starting Docker environment...');
    await runCommand('make start', { cwd: './analytics-service-main' });
    console.log('Docker environment started.');
    console.log('Waiting for services to stabilize...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('Running import-logs...');
    await runCommand('make import-logs', { cwd: './analytics-service-main' });
    console.log('import-logs completed.');
  } catch (error) {
    console.error('Failed to start Docker environment or run import-logs:', error);
    process.exit(1);
  }
}

startDocker();
