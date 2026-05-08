const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const test = require('node:test');

function parseEnvExample(source) {
  return Object.fromEntries(
    source
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const separatorIndex = line.indexOf('=');
        assert.notEqual(separatorIndex, -1, `Expected env assignment: ${line}`);

        const key = line.slice(0, separatorIndex);
        const rawValue = line.slice(separatorIndex + 1);
        const value = rawValue.replace(/^"|"$/g, '');

        return [key, value];
      }),
  );
}

test('.env.example documents safe local environment placeholders', async () => {
  const envExample = parseEnvExample(await readFile('.env.example', 'utf8'));

  assert.deepEqual(Object.keys(envExample), [
    'DATABASE_URL',
    'PORT',
    'JWT_SECRET',
    'API_KEY',
  ]);

  assert.equal(envExample.DATABASE_URL, 'file:./dev.db');
  assert.equal(envExample.PORT, '3000');
  assert.match(envExample.JWT_SECRET, /example|change|placeholder/i);
  assert.match(envExample.API_KEY, /example|change|placeholder/i);
});

test('README setup points developers to copy the example env file', async () => {
  const readme = await readFile('README.md', 'utf8');

  assert.match(readme, /cp \.env\.example \.env/);
});
