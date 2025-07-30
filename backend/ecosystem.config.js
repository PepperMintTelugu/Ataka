module.exports = {
  apps: [
    {
      name: "telugu-books-backend",
      script: "src/server.js",
      instances: "max", // Use all available CPU cores
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,

      // Restart configuration
      autorestart: true,
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: "10s",

      // Monitoring
      monitoring: true,
      pmx: true,

      // Source map support
      source_map_support: true,

      // Environment specific settings
      node_args: "--max-old-space-size=1024",

      // Kill timeout
      kill_timeout: 5000,

      // Wait ready
      wait_ready: true,
      listen_timeout: 3000,

      // Health check
      health_check_grace_period: 3000,

      // Advanced features
      ignore_watch: ["node_modules", "logs", "uploads"],
      watch_options: {
        followSymlinks: false,
      },
    },
  ],

  deploy: {
    production: {
      user: "node",
      host: "your-server-ip",
      ref: "origin/main",
      repo: "git@github.com:your-username/telugu-books-ecommerce.git",
      path: "/var/www/telugu-books",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
      ssh_options: "StrictHostKeyChecking=no",
    },
  },
};
