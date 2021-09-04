#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

if (process.argv.length < 3) {
    console.log('\nYou have to provide a name to your app.');
    console.log('\n[ for example ]');
    console.log('npx create-my-boilerplate my-app');
    process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const gitRepo = 'https://github.com/joshxfi/vr2t-boilerplate.git';

try {
    fs.mkdirSync(projectPath);
} catch (err) {
    err.code === 'EEXIST' ? console.log(`The file ${projectName} already exists, please use a different name for your project.`) : console.log(err)

    process.exit(1);
}

const main = async () => {
    try {
        console.log('Downloading files...');
        // execSync(`git clone --depth 1 ${gitRepo} ${projectPath}`);

        process.chdir(projectPath);

        console.log('Installing dependencies...');
        // execSync('yarn install');

        console.log('Removing unnecessary files...');
        // execSync('npx rimraf ./.git');
        // fs.rmdirSync(path.join(projectPath, 'bin'), { recursive: true });

        console.log('The installation is complete.');
    } catch (err) {
        console.log(err)
    }
}
main();