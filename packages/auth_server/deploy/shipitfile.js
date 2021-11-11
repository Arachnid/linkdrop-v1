module.exports = shipit => {
  require('shipit-deploy')(shipit)

  const customerApp = 'kryptochurch-twitter-alfa'

  const PM2_APP_NAME = `authdrop-${customerApp}`
  let CUSTOM_PORT = 2315
  

  shipit.initConfig({
    default: {
      repositoryUrl: 'git@github.com:LinkdropHQ/linkdrop-monorepo.git',
      keepReleases: 3,
      deployTo: `authdrop/${customerApp}`,
      servers: 'root@auth-api.linkdrop.io'
    },
    campaing: { branch: 'dev_kryptochurch_server' },
  })

  shipit.blTask('installDependencies', async () => {
    await shipit.remote(
      `cd ${shipit.releasePath} && yarn cache clean && yarn install`
    )
    shipit.log('Installed yarn dependecies')
  })

  shipit.task('copyConfig', async () => {
    await shipit.copyToRemote(
      '../../../configs/auth.config.json',
      `authdrop/${customerApp}/current/configs/auth.config.json`
    )
  })

  shipit.task('compileContracts', async () => {
    await shipit.remote(`cd ${shipit.releasePath} && yarn compile-contracts`)
  })

  shipit.blTask('stopApp', async () => {
    try {
      await shipit.remote(
        `cd ${shipit.releasePath} && pm2 stop ${PM2_APP_NAME} && pm2 delete ${PM2_APP_NAME}`
      )
      shipit.log('Stopped app process')
    } catch (err) {
      shipit.log('No previous process to restart. Continuing.')
    }
  })

  shipit.blTask('startApp', async () => {
    await shipit.remote(
      `cd ${shipit.releasePath} && CUSTOM_PORT=${CUSTOM_PORT} pm2 start --name ${PM2_APP_NAME} npm -- run auth-server`
    )
    shipit.log('Started app process')
  })

  shipit.on('updated', () => {
    shipit.start(['installDependencies'])
  })

  shipit.on('published', () => {
    shipit.start(['copyConfig', 'compileContracts', 'stopApp', 'startApp'])
  })
}
