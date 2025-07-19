module.exports = {
  apps: [{
    name: 'myquiz',
    script: 'server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 5001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5001,
      JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production'
    }
  }]
}; 