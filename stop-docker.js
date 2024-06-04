const { exec } = require('child_process');

function runCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    const process = exec(command, options, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
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

async function stopDocker() {
  try {
    console.log('Stopping Docker environment...');
    await runCommand('make stop', { cwd: './analytics-service-main' });
    console.log('Docker environment stopped.');
  } catch (error) {
    console.error('Failed to stop Docker environment:', error);
    process.exit(1);
  }
}

stopDocker();
