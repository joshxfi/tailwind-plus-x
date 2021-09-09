import fs from 'fs';
import path from 'path';
import colors from 'colors';
import inquirer from 'inquirer';
import { execSync } from 'child_process';

const main = async () => {
  const cwd = process.cwd();
  const res = execSync('npm list -g', { stdio: 'pipe' });

  // Generate with no flag option

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

    let useNpm = answers['useNpm'];

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
    const boilerplatePath = path.join(__dirname, 'templates', 'vr2t');

    try {
      fs.mkdirSync(path.join(cwd, projectName));
    } catch (err) {
      if (err.code === 'EEXIST') {
        console.log(
          colors.red(`\n→ The folder ${projectName} already exists.`)
        );
        console.log(colors.red('→ Please use a different name for your project.'));
      } else console.log(err);
      process.exit(1);
    }

    generateBoilerplate(boilerplatePath, projectName);

    process.chdir(path.join(cwd, projectName));

    // Generate with flag option
  } else {
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
};

main();
