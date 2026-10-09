import { readFile, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({
  configFile: './vite.config.ts',
  server: { middlewareMode: true },
  appType: 'custom',
});

try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const markup = renderToString(createElement(App));
  const htmlPath = new URL('../dist/index.html', import.meta.url);
  const html = await readFile(htmlPath, 'utf8');
  const root = '<div id="root"></div>';

  if (!html.includes(root)) {
    throw new Error('Could not find the expected #root element in dist/index.html');
  }

  await writeFile(htmlPath, html.replace(root, `<div id="root">${markup}</div>`), 'utf8');
  process.stdout.write('Prerendered HOROLOGY page into dist/index.html\n');
} finally {
  await server.close();
}
