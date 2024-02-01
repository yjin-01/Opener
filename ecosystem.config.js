module.exports = {
    apps: [
       {
          name: 'p1z7',
          script: './dist/src/main.js',
          instances: 1,
          env: {
            Server_PORT: 3000,
            NODE_ENV: 'dev',
          },
          exec_mode: 'fork'
       },
    ],
 };