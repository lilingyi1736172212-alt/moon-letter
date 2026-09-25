// Generates absolute sharing URLs after the hosting provider supplies the real address.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const input = process.env.PUBLIC_SITE_URL || process.argv[2];
if (!input) throw new Error('Please provide the public HTTPS website address.');
const site = new URL(input);
if (site.protocol !== 'https:' || site.username || site.password || site.search || site.hash) {
  throw new Error('Expected an HTTPS website address without credentials, query or fragment.');
}
site.pathname = site.pathname.replace(/\/$/, '') + '/';
const cover = new URL('assets/share-cover.png', site);
const escape = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const start = '<!-- SHARE-METADATA:START -->';
const end = '<!-- SHARE-METADATA:END -->';
const markup = `${start}
  <link rel="canonical" href="${escape(site.href)}">
  <meta property="og:url" content="${escape(site.href)}">
  <meta property="og:image" content="${escape(cover.href)}">
  <meta property="og:image:width" content="1536">
  <meta property="og:image:height" content="1024">
  <meta property="og:image:alt" content="月下有书信，又是一年中秋。月光下的一封桂花书信。">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="月下有书信">
  <meta name="twitter:description" content="又是一年中秋。愿这轮明月为你带去一份温暖的祝福。">
  <meta name="twitter:image" content="${escape(cover.href)}">
  ${end}`;
const file = path.join(root, 'dist', 'index.html');
let html = fs.readFileSync(file, 'utf8');
if (html.includes(start)) {
  html = html.replace(/<!-- SHARE-METADATA:START -->[\s\S]*?<!-- SHARE-METADATA:END -->/, markup);
} else {
  if (!html.includes('</head>')) throw new Error('Page head is missing.');
  html = html.replace('</head>', `  ${markup}\n</head>`);
}
fs.writeFileSync(file, html);
console.log('Sharing metadata prepared for ' + site.href);
