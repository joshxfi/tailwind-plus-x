import { execSync } from 'child_process';
import path from 'path';
import colors from 'colors';
import fs from 'fs';
import inquirer from 'inquirer';

const main = async () => {
  const res = execSync('npm list -g', { stdio: 'pipe' });

  if (!process.argv[2]) {
    let useNpm = true;

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
      console.log(colors.gray('\n→ Using yarn to install packages'));
      useNpm = false;
    } else if (!useNpm) {
      console.log(colors.gray('\n→ Cannot find yarn'));
      console.log(colors.gray('→ Using npm to install packages'));
      useNpm = true;
    } else {
      console.log(colors.gray('\n→ Using npm to install packages'));
      useNpm = true;
    }

    cloneBoilerplate({
      useNpm,
      projectName: answers['projectName'],
    });
  } else {
    const projectName = process.argv[2];
    const npmFlag = process.argv[3];
    let useNpm = true;

    if (npmFlag && npmFlag !== '--npm') {
      console.log(colors.gray('\n→ Unrecognized flag'));
      process.exit(1);
    } else if (npmFlag === '--npm') {
      console.log(colors.gray('\n→ Using npm to install packages'));
      useNpm = true;
    } else if (res.toString().includes('yarn@')) {
      console.log(colors.gray('\n→ Using yarn to install packages'));
      useNpm = false;
    } else {
      console.log(colors.gray('\n→ Cannot find yarn'));
      console.log(colors.gray('→ Using npm to install packages'));
      useNpm = true;
    }

    cloneBoilerplate({ projectName, useNpm });
  }
};

interface CloneBoilerplateProps {
  projectName: string;
  useNpm: boolean;
}

const cloneBoilerplate = async ({
  projectName,
  useNpm,
}: CloneBoilerplateProps) => {
  const projectPath: string = path.join(process.cwd(), projectName);
  const gitRepo = 'https://github.com/joshxfi/vr2t-boilerplate.git';

  try {
    fs.mkdirSync(projectPath);
  } catch (err) {
    err.code === 'EEXIST'
      ? console.log(
          `\n→ The folder ${projectName} already exists, please use a different name for your project.`
            .red
        )
      : console.log(err);
    process.exit(1);
  }

  try {
    console.log(colors.green('→ Downloading files...'));
    execSync(`git clone --depth 1 ${gitRepo} ${projectPath}`);

    process.chdir(projectPath);

    // this will remove the remote repository
    execSync('git remote remove origin');

    console.log(colors.yellow('\n→ Installing the dependencies...'));
    if (useNpm) {
      console.log(colors.gray('→ Installing with npm...'));
      execSync('npm i', { stdio: 'inherit' });
    } else {
      console.log(colors.gray('→ Installing with yarn...'));
      execSync('yarn', { stdio: 'inherit' });
    }

    console.log(colors.green.bold('\n  [ Installed Successfully! ]'));
    console.log('\n→ cd to your project & run the dev server.'.magenta);
    console.log(colors.yellow(`\ncd ${projectName}`));
    console.log(colors.green('\nfor yarn:'), colors.yellow('\n└─ yarn dev'));
    console.log(colors.green('\nfor npm:'), colors.yellow('\n└─ npm run dev'));
  } catch (err) {
    console.log(err);
  }
};

main();
