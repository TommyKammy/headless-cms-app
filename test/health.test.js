const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const net = require('node:net');
const test = require('node:test');

async function getOpenPort() {
  const server = net.createServer();

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const { port } = server.address();

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.close(resolve);
  });

  return port;
}

async function startServer(port) {
  const child = spawn(process.execPath, ['src/server.js'], {
    env: {
      ...process.env,
      PORT: String(port),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (chunk) => {
    stdout += chunk;
  });
  child.stderr.on('data', (chunk) => {
    stderr += chunk;
  });

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Server did not start. stdout: ${stdout} stderr: ${stderr}`));
    }, 5000);

    child.once('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Server exited early with code ${code}. stdout: ${stdout} stderr: ${stderr}`));
    });

    child.stdout.on('data', () => {
      if (stdout.includes(`Server is running on port ${port}`)) {
        clearTimeout(timer);
        resolve();
      }
    });
  });

  return child;
}

async function stopServer(child) {
  if (child.exitCode !== null) {
    return;
  }

  child.kill('SIGTERM');

  await new Promise((resolve) => {
    child.once('exit', resolve);
    setTimeout(resolve, 1000);
  });
}

test('GET /health returns unauthenticated JSON status', async (t) => {
  const port = await getOpenPort();
  const server = await startServer(port);
  t.after(() => stopServer(server));

  const response = await fetch(`http://127.0.0.1:${port}/health`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json\b/);
  assert.deepEqual(await response.json(), {
    status: 'ok',
    service: 'headless-cms',
  });
});

test('existing root and protected API routing behavior is unchanged', async (t) => {
  const port = await getOpenPort();
  const server = await startServer(port);
  t.after(() => stopServer(server));

  const rootResponse = await fetch(`http://127.0.0.1:${port}/`);
  assert.equal(rootResponse.status, 200);
  assert.match(rootResponse.headers.get('content-type'), /^text\/html\b/);

  const adminResponse = await fetch(`http://127.0.0.1:${port}/api/admin/models`);
  assert.equal(adminResponse.status, 401);
  assert.deepEqual(await adminResponse.json(), {
    error: 'Access denied. No token provided.',
  });

  const publicResponse = await fetch(`http://127.0.0.1:${port}/api/v1/example`);
  assert.equal(publicResponse.status, 401);
  assert.deepEqual(await publicResponse.json(), {
    error: 'Invalid or missing API key',
  });
});
