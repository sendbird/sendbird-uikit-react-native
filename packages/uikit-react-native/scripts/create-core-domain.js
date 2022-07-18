const fsP = require('fs/promises');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const glob = require('glob');
const { toCamelCase, toPascalCase } = require('js-convert-case');

const packagesRoot = path.resolve(__dirname, '../../');

const sendbirdUIKitRoot = path.resolve(packagesRoot, 'uikit-react-native');
const fragmentsRoot = path.resolve(sendbirdUIKitRoot, 'src/fragments');
const domainRoot = path.resolve(sendbirdUIKitRoot, 'src/domain');
const templateRoot = path.resolve(sendbirdUIKitRoot, '__template__');

inquirer
  .prompt([
    {
      type: 'input',
      message: 'Enter domain name (e.g. groupChannel)',
      name: 'domain',
    },
  ])
  .then(async (answer) => {
    const __domain__ = answer['domain'];

    if (/[\s_-]/g.test(__domain__)) {
      console.log(chalk.bold.red('⚠️Error, please enter the domain as a camel or pascal case'));
      return;
    }

    if (/[^a-zA-Z]/g.test(__domain__)) {
      console.log(chalk.bold.red('⚠️Error, please enter the domain in English only'));
      return;
    }

    const domainPath = path.resolve(domainRoot, __domain__);
    if (fs.existsSync(domainPath)) {
      console.log(chalk.bold.red('⚠️Error, there is already exist domain\n' + domainPath));
      return;
    }

    console.log(chalk.white('Read template files...'));
    const templateFilePaths = glob.sync(`${templateRoot}/**/*.{ts,tsx}`);
    const readPromises = templateFilePaths.map(async (filePath) => {
      const data = await fsP.readFile(filePath, { encoding: 'utf8' });
      return { filePath, data };
    });

    console.log(chalk.white('Write template files...'));
    const templateFiles = await Promise.all(readPromises);
    const writePromises = templateFiles.map(async ({ filePath, data }) => {
      // filePath:        ~/packages/uikit-react-native/__template__/**/__domain__
      // domainFilePath:  ~/packages/uikit-react-native/domain/someDomain/**/SomeDomain
      const domainFilePath = domainReplacer(templateReplacer(filePath, __domain__), __domain__);

      if (isFragmentTemplate(filePath)) {
        console.log(chalk.white('Write Fragment template...'));
        const currentDomainRoot = path.resolve(sendbirdUIKitRoot, __domain__);
        const destPath = domainFilePath.replace(currentDomainRoot, fragmentsRoot);
        await fsP.mkdir(path.dirname(destPath), { recursive: true });
        return fsP.writeFile(destPath, ignoreReplacer(templateReplacer(domainReplacer(data, __domain__), __domain__)));
      } else {
        console.log(chalk.white('Write Module template...'));
        const destPath = domainFilePath.replace(sendbirdUIKitRoot, domainRoot);
        await fsP.mkdir(path.dirname(destPath), { recursive: true });
        return fsP.writeFile(destPath, ignoreReplacer(templateReplacer(domainReplacer(data, __domain__), __domain__)));
      }
    });
    await Promise.all(writePromises);

    console.log(chalk.green('Finished'));
  });
function isFragmentTemplate(path) {
  return path.includes('create__domain__Fragment');
}
function templateReplacer(str, __domain__) {
  return str.replace(/__template__/g, toCamelCase(__domain__));
}
function domainReplacer(str, __domain__) {
  return str.replace(/__domain__/g, toPascalCase(__domain__));
}
function ignoreReplacer(str) {
  return str.replace(/\/\/ @ts-nocheck - !!REMOVE\n/g, '');
}
