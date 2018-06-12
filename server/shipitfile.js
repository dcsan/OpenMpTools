module.exports = function (shipit) {

  shipit.initConfig({
    default: {
      // workspace: '/tmp/' + appname,
      // deployTo: `/tmp/${appname}/deployTo`,
      // repositoryUrl: 'https://github.com/user/repo.git',
      ignores: [
        '.git',
        'server/uploads',
        'server/assets',
        // "server/node_modules",
        // "node_modules",
      ],
      rsync: ['--verbose'],
      keepReleases: 2,
      servers: [
        'ubuntu@deploy.rikai-bots.com'
      ],
      remoteBackupDir: "/opt/rikai/mongodump/dumps/",
      localBackupDir: "./server/data/backups/",
      appname: 'rikpay',
      dbName: 'rikpay',
      port: 9290,
      deployDir: '/opt/rikai/web-apps/rikpay'
      // key: '/path/to/key',
      // shallowClone: true
    },

    prod: {

    },

    dev: { },
    local: { }
  })


  shipit.blTask('setup', async function () {
    shipit.log('prepare remote server', shipit.config)
    await shipit.remote(`mkdir ${shipit.config.deployDir}`)
  })

  // ---------- deploy ----------

  shipit.blTask('coldStart', function () {
    // first time to startup, pm2 needs 'start' not 'restart'
    return shipit.remote(`cd ${shipit.config.deployDir} && PORT=${shipit.config.port} DEBUG=*,-express* pm2 start server.js --name ${shipit.config.appname}`)
  })

  shipit.blTask('pm2-delete', async function () {
    // ignore error if it doesnt exist
    await shipit.remote(`pm2 delete ${shipit.config.appname}`).then( () => {
      console.log("deleted pm2 process")
    }).catch( err => {
      console.warn("error deleting pm2 process ", shipit.config.appname, err)
    })
    // return shipit.log('deleted', res)
  })

  shipit.blTask('pm2-start', async function () {
    await shipit.remote(`cd ${shipit.config.deployDir} && PORT=${shipit.config.port} DEBUG=*,-express* pm2 start server.js --name ${shipit.config.appname}`)
  })

  shipit.blTask('pm2-restart', async function () {
    await shipit.remote(`pm2 restart ${shipit.config.appname}`)
  })

  shipit.blTask('logs', function () {
    shipit.remote(`pm2 logs ${shipit.config.appname}`)
  })

  shipit.blTask('yarn', function () {
    return shipit.remote(`cd ${shipit.config.deployDir} && yarn install`)
  })

  shipit.blTask('sync', async function () {
    shipit.log('sync to ', shipit.config.deployDir)
    await shipit.remoteCopy('.', shipit.config.deployDir)
    return shipit.log('sync done')
  })

  shipit.blTask('deploy', ['sync', 'yarn', 'pm2-delete', 'pm2-start', 'logs'], async function () {
    return shipit.log('deploy done')
  })

  // quick deploy
  shipit.blTask('qd', ['sync', 'pm2-restart', 'logs'], async function () {
    return shipit.log('deploy done')
  })

}