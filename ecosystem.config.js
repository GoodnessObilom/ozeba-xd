module.exports = {
  apps: [{
    name: "OZEBA-XD",
    script: "index.js",
    watch: false, // Set to false to prevent the restart loop
    ignore_watch: ["node_modules", "lib", "sessions", "temp"],
    log_file: "pm2_log.log",
    autorestart: true,
    max_memory_restart: '1024M',
    env: {
      NODE_ENV: "production"
    }
  }]
}