import fs from 'fs';
import path from 'path';
import colors from 'colors';
import inquirer from 'inquirer';
import { execSync } from 'child_process';

const main = async () => {
  let useNpm = true;
  const cwd = process.cwd();
  const res = execSync('npm list -g', { stdio: 'pipe' });
  const boilerplatePath = path.join(__dirname, 'templates', 'vr2t');

  // Generate with no project name & flag option
  if (!process.argv[2]) {
    const answers = await inquirer.prompt([
      {
        message: "What is the project's name?",
        name: 'projectName',
        default: 'my-vr2t-app',
      },

      {
        message: 'Do you want to use npm?',
        name: 'useNpm',
        type: 'confirm',
        default: true,
      },
    ]);

    useNpm = answers['useNpm'];

    if (!useNpm && res.toString().includes('yarn@')) {
      console.log(colors.gray('\n→ Using yarn to install packages.'));
      useNpm = false;
    } else if (!useNpm) {
      console.log(colors.gray('\n→ Cannot find yarn.'));
      console.log(colors.gray('→ Using npm to install packages.'));
      useNpm = true;
    } else {
      console.log(colors.gray('\n→ Using npm to install packages.'));
      useNpm = true;
    }

    const projectName = answers['projectName'];
    generateApp(projectName);

    // Generate with name &/ flag option
  } else {
    const projectName = process.argv[2];
    const npmFlag = process.argv[3];

    if (npmFlag && npmFlag !== '--npm')
      console.log(colors.gray('\n→ Unrecognized flag'));
    else if (npmFlag === '--npm') {
      console.log(colors.gray('\n→ Using npm to install packages.'));
      useNpm = true;
    } else if (res.toString().includes('yarn@')) {
      console.log(colors.gray('\n→ Using yarn to install packages'));
      useNpm = false;
    } else {
      console.log(colors.gray('\n→ Cannot find yarn'));
      console.log(colors.gray('→ Using npm to install packages'));
      useNpm = true;
    }

    generateApp(projectName);
  }

  async function generateBoilerplate(boilerplate: string, title: string) {
    const filesToCreate = fs.readdirSync(boilerplate);

    filesToCreate.forEach((file) => {
      const origFilePath = path.join(boilerplate, file);
      const writePath = path.join(cwd, title, file);

      const stats = fs.statSync(origFilePath);

      if (stats.isFile()) {
        const contents = fs.readFileSync(origFilePath, 'utf8');

        fs.writeFileSync(writePath, contents, 'utf8');
      } else if (stats.isDirectory()) {
        fs.mkdirSync(writePath);

        // run recursively
        generateBoilerplate(
          path.join(boilerplate, file),
          path.join(title, file)
        );
      }
    });
  }

  function installPackages(useNpm: boolean, title: string) {
    try {
      if (useNpm) execSync('npm i', { stdio: 'inherit' });
      else execSync('yarn', { stdio: 'inherit' });

      console.log(colors.green.bold('\n  [ Installed Successfully! ]'));
      console.log('\n→ cd to your project & run the dev server.'.gray);

      console.log(colors.yellow(`\ncd ${title}`));

      if (useNpm) console.log(colors.yellow('npm run dev'));
      else console.log(colors.yellow('yarn dev'));
    } catch (err) {
      console.log(err);
    }
  }

  function makeProjectFolder(title: string) {
    try {
      fs.mkdirSync(path.join(cwd, title));
    } catch (err) {
      if (err.code === 'EEXIST') {
        console.log(colors.red(`\n→ The folder ${title} already exists.`));
        console.log(
          colors.red('→ Please use a different name for your project.')
        );
      } else console.log(err);
      process.exit(1);
    }
  }

  async function generateApp(projectName: string) {
    makeProjectFolder(projectName);
    await generateBoilerplate(boilerplatePath, projectName);
    process.chdir(path.join(cwd, projectName));
    fs.renameSync('_gitignore', '.gitignore');
    fs.renameSync('_prettierrc', '.prettierrc');
    installPackages(useNpm, projectName);
  }
};

main();
