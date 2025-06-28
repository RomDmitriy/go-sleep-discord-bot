module.exports = {
  apps: [
    {
      name: 'go-sleep-bot',
      script: './dist/bot.js',
      cwd: './', // чтобы dotenv работал из корня
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
