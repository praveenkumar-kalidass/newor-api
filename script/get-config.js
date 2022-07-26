const https = require('https');
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Octokit } = require('octokit');

const octokit = new Octokit({
  auth: process.env.TOKEN,
});

const envConfig = octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
  owner: process.env.OWNER,
  repo: process.env.CONFIG_REPOSITORY,
  path: `env/${process.env.DEPLOY_ENV}/api/.envrc`,
});
const databaseConfig = octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
  owner: process.env.OWNER,
  repo: process.env.CONFIG_REPOSITORY,
  path: `env/${process.env.DEPLOY_ENV}/api/database.json`,
});
const appConfig = octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
  owner: process.env.OWNER,
  repo: process.env.CONFIG_REPOSITORY,
  path: `env/${process.env.DEPLOY_ENV}/api/config.json`,
});

const configs = [
  { file: '.envrc', path: '.envrc', config: envConfig },
  { file: 'database.json', path: './config/database.json', config: databaseConfig },
  { file: 'config.json', path: './config/config.json', config: appConfig },
];

Promise
  .all(configs.map((data) => data.config))
  .then((configResponse) => {
    configs.forEach(({ path }, index) => {
      const file = fs.createWriteStream(path);
      https.get(configResponse[index].data.download_url, { headers: { 'User-Agent': process.env.OWNER } }, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`${path} generated successfully`);
        });
      });
    });
  }).catch((error) => {
    console.log('Unable to get configs. Error: ', error);
    process.exit(1);
  });
