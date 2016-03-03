const spawn = require('child_process').spawn;
const python_spawn = spawn('python', ['./main.py', '/usr']);

python_spawn.stdout.on('data', (data) => {
  console.log(`stdout: ${typeof(data)} ${data}`);
});

python_spawn.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

python_spawn.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
