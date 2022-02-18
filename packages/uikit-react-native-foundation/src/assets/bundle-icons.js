const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const ignorePatterns = /bundle-icons\.js|\.DS_Store|index\.ts|@2x|@3x/;
const requireBasePath = './';
const iconPath = path.join(__dirname, 'icon');
const icons = {};

fs.readdirSync(iconPath).forEach((filename) => {
  if (filename.match(ignorePatterns)) return;
  const ext = path.extname(filename);
  const name = filename.replace(ext, '').replace(/icon-|ic-/g, '');
  const assetPath = requireBasePath + filename;
  icons[name] = `require('${assetPath}')`;
});

const serializedIcons = JSON.stringify(icons, null, 4).replace(
  /("require\()('.+')(\)")/g,
  (_, a, b, c) => a.replace('"', '') + b + c.replace('"', ''),
);
const exportString = `const IconAssets = ${serializedIcons}; export default IconAssets`;

fs.writeFileSync(
  path.join(iconPath, 'index.ts'),
  prettier.format(exportString, {
    'printWidth': 120,
    'tabWidth': 2,
    'useTabs': false,
    'semi': true,
    'singleQuote': true,
    'quoteProps': 'preserve',
    'trailingComma': 'all',
    'bracketSpacing': true,
    'arrowParens': 'always',
  }),
);
