import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';

const main = async () => {
  // const res = execSync('npm list -g', { stdio: 'pipe' });

  if (!process.argv[2]) {
    const answers = await inquirer.prompt([
      {
        message: "What is the project's name?",
        name: 'projectName',
        default: 'my-vr2t-app',
      },
    ]);

    const cwd = process.cwd();
    const projectName = answers['projectName'];
    const boilerplatePath = path.join(__dirname, 'templates', 'vr2t');

    fs.mkdirSync(path.join(cwd, projectName));
    generateBoilerplate(boilerplatePath, projectName);

    function generateBoilerplate(boilerplate: string, title: string) {
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
  }
};

main();
