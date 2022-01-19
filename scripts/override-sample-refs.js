const fs = require('fs');
const path = require('path');

const packagePath = path.resolve(__dirname, '../packages');
const packages = fs.readdirSync(packagePath).filter(p => !p.match(/.DS_Store/));

const samplePath = path.resolve(__dirname, '../sample');
const sampleTsConfig = require(path.join(samplePath, 'tsconfig.json'));

const relPath = path.relative(samplePath, packagePath);

sampleTsConfig.references = packages.map(packageName => ({
  path: path.join(relPath, packageName)
}));

fs.writeFileSync(path.join(samplePath, 'tsconfig.json'), JSON.stringify(sampleTsConfig, null, 2));
