/**
 * @description pm2 configuration file.
 * @example
 *  production mode :: pm2 start ecosystem.config.js --only prod
 *  development mode :: pm2 start ecosystem.config.js --only dev
 *  test mode :: pm2 start ecosystem.config.js --only test
 */
module.exports = {
  apps: [
    {
      name: "muzzgen-prod", // pm2 start App name
      script: "./dist/app.js",
      exec_mode: "cluster", // 'cluster' or 'fork'
      instance_var: "INSTANCE_ID", // instance variable
      instances: 2, // pm2 instance count
      autorestart: true, // auto restart if process crash
      watch: false, // files change automatic restart
      ignore_watch: ["node_modules", "logs"], // ignore files change
      max_memory_restart: "1G", // restart if process use more than 1G memory
      merge_logs: true, // if true, stdout and stderr will be merged and sent to pm2 log
      output: "./logs/access.log", // pm2 log file
      error: "./logs/error.log", // pm2 error log file
      env: {
        // environment variable
        PORT: 5003,
        NODE_ENV: "production",
      },
    },
    {
      name: "muzzgen-dev", // pm2 start App name
      script: "./dist/app.js",
      args: "-r tsconfig-paths/register --transpile-only src/app.ts", // ts-node args
      exec_mode: "cluster", // 'cluster' or 'fork'
      instance_var: "INSTANCE_ID", // instance variable
      instances: 2, // pm2 instance count
      autorestart: true, // auto restart if process crash
      watch: false, // files change automatic restart
      ignore_watch: ["node_modules", "logs"], // ignore files change
      max_memory_restart: "1G", // restart if process use more than 1G memory
      merge_logs: true, // if true, stdout and stderr will be merged and sent to pm2 log
      output: "./logs/access.log", // pm2 log file
      error: "./logs/error.log", // pm2 error log file
      env: {
        // environment variable
        PORT: 5001,
        NODE_ENV: "development",
      },
    },
    {
      name: "muzzgen-test", // pm2 start App name for test environment
      script: "./dist/app.js",
      exec_mode: "cluster", // 'cluster' or 'fork'
      instance_var: "INSTANCE_ID", // instance variable
      instances: 2, // pm2 instance count
      autorestart: true, // auto restart if process crash
      watch: false, // files change automatic restart
      ignore_watch: ["node_modules", "logs"], // ignore files change
      max_memory_restart: "1G", // restart if process use more than 1G memory
      merge_logs: true, // if true, stdout and stderr will be merged and sent to pm2 log
      output: "./logs/access.log", // pm2 log file
      error: "./logs/error.log", // pm2 error log file
      env: {
        // environment variable
        PORT: 5002, // Change port for test
        NODE_ENV: "test", // Set test environment variable
      },
    },
  ],
  deploy: {
    development: {
      user: "user",
      host: "0.0.0.0",
      ref: "origin/master",
      repo: "git@github.com:repo.git",
      path: "dist/app.js",
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --only dev",
    },
    production: {
      user: "user",
      host: "0.0.0.0",
      ref: "origin/master",
      repo: "git@github.com:repo.git",
      path: "dist/app.js",
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --only prod",
    },
    test: {
      user: "user",
      host: "0.0.0.0",
      ref: "origin/test", // Assuming there's a separate branch for test
      repo: "git@github.com:repo.git",
      path: "dist/app.js",
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --only test",
    },
  },
};
