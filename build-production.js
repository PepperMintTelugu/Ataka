#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("🏗️  Building Telugu Books Ecommerce for Production...\n");

const CONFIG = {
  domain: process.env.DOMAIN || "store.ataka.co.in",
  apiUrl: process.env.API_URL || "https://store.ataka.co.in/api",
  outputDir: "dist",
  backendDir: "backend",
};

// Colors for console output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function step(message) {
  log(`\n📋 ${message}`, "blue");
}

function success(message) {
  log(`✅ ${message}`, "green");
}

function warning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function error(message) {
  log(`❌ ${message}`, "red");
}

try {
  // Step 1: Clean previous builds
  step("Cleaning previous builds...");
  if (fs.existsSync(CONFIG.outputDir)) {
    execSync(`rm -rf ${CONFIG.outputDir}`, { stdio: "inherit" });
  }
  success("Cleaned previous builds");

  // Step 2: Install frontend dependencies
  step("Installing frontend dependencies...");
  execSync("npm ci --production=false", { stdio: "inherit" });
  success("Frontend dependencies installed");

  // Step 3: Install backend dependencies
  step("Installing backend dependencies...");
  process.chdir(CONFIG.backendDir);
  execSync("npm ci --production", { stdio: "inherit" });
  process.chdir("..");
  success("Backend dependencies installed");

  // Step 4: Create production environment file
  step("Creating production environment configuration...");
  const envProduction = `# Telugu Books Ecommerce - Production Environment
VITE_API_BASE_URL=${CONFIG.apiUrl}
VITE_GOOGLE_CLIENT_ID=\${GOOGLE_CLIENT_ID}
VITE_RAZORPAY_KEY_ID=\${RAZORPAY_KEY_ID}
VITE_APP_NAME=Telugu Books
VITE_APP_VERSION=1.0.0
VITE_APP_DOMAIN=${CONFIG.domain}
`;

  fs.writeFileSync(".env.production", envProduction);
  success("Production environment file created");

  // Step 5: Build frontend
  step("Building frontend for production...");
  execSync("npm run build", { stdio: "inherit" });
  success("Frontend built successfully");

  // Step 6: Create production package.json for deployment
  step("Creating deployment package.json...");
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const deploymentPackage = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    main: "backend/src/server.js",
    scripts: {
      start: "cd backend && node src/server.js",
      "start:prod": "NODE_ENV=production cd backend && node src/server.js",
    },
    engines: packageJson.engines || {
      node: ">=18.0.0",
      npm: ">=8.0.0",
    },
    dependencies: {},
  };

  // Copy only production dependencies from backend
  const backendPackage = JSON.parse(
    fs.readFileSync("backend/package.json", "utf8"),
  );
  deploymentPackage.dependencies = backendPackage.dependencies;

  fs.writeFileSync(
    `${CONFIG.outputDir}/package.json`,
    JSON.stringify(deploymentPackage, null, 2),
  );
  success("Deployment package.json created");

  // Step 7: Copy backend files to dist
  step("Copying backend files...");
  execSync(`cp -r ${CONFIG.backendDir} ${CONFIG.outputDir}/`, {
    stdio: "inherit",
  });
  success("Backend files copied");

  // Step 8: Create uploads directory structure
  step("Creating uploads directory structure...");
  const uploadsStructure = [
    "uploads/books",
    "uploads/brands",
    "uploads/users",
    "logs",
  ];

  uploadsStructure.forEach((dir) => {
    const fullPath = path.join(CONFIG.outputDir, dir);
    fs.mkdirSync(fullPath, { recursive: true });

    // Create .gitkeep files
    fs.writeFileSync(path.join(fullPath, ".gitkeep"), "");
  });
  success("Uploads directory structure created");

  // Step 9: Create deployment README
  step("Creating deployment instructions...");
  const deploymentReadme = `# Telugu Books Ecommerce - Production Deployment

## Quick Start

1. Upload all files to your web server
2. Install Node.js dependencies:
   \`\`\`bash
   npm install --production
   \`\`\`

3. Set up environment variables in \`backend/.env\`:
   \`\`\`bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   \`\`\`

4. Start the application:
   \`\`\`bash
   npm start
   \`\`\`

## Domain: ${CONFIG.domain}
## API URL: ${CONFIG.apiUrl}

## Built on: ${new Date().toISOString()}
## Version: ${packageJson.version}

For detailed deployment instructions, see DEPLOYMENT-GUIDE.md
`;

  fs.writeFileSync(`${CONFIG.outputDir}/README.md`, deploymentReadme);
  success("Deployment instructions created");

  // Step 10: Create .htaccess for Apache servers
  step("Creating Apache .htaccess configuration...");
  const htaccess = `# Telugu Books Ecommerce - Apache Configuration

RewriteEngine On

# API Proxy (if using same domain)
RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]

# Handle Angular Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security Headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache Control
<filesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, immutable"
</filesMatch>

<filesMatch "\\.(html|htm)$">
    ExpiresActive On
    ExpiresDefault "access plus 0 seconds"
    Header set Cache-Control "no-cache, no-store, must-revalidate"
</filesMatch>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Deny access to sensitive files
<Files ~ "\\.(env|log|gitignore)$">
    Order allow,deny
    Deny from all
</Files>
`;

  fs.writeFileSync(`${CONFIG.outputDir}/.htaccess`, htaccess);
  success("Apache .htaccess created");

  // Step 11: Generate build summary
  step("Generating build summary...");
  const buildSummary = {
    buildDate: new Date().toISOString(),
    version: packageJson.version,
    domain: CONFIG.domain,
    apiUrl: CONFIG.apiUrl,
    files: {
      frontend: fs
        .readdirSync(CONFIG.outputDir)
        .filter(
          (f) =>
            !f.startsWith(".") &&
            f !== "backend" &&
            f !== "uploads" &&
            f !== "logs",
        ),
      backend: fs.readdirSync(`${CONFIG.outputDir}/backend`),
      uploads: uploadsStructure,
    },
    size: {
      total: execSync(`du -sh ${CONFIG.outputDir}`, { encoding: "utf8" }).split(
        "\t",
      )[0],
      frontend: execSync(
        `du -sh ${CONFIG.outputDir} --exclude=backend --exclude=uploads --exclude=logs`,
        { encoding: "utf8" },
      ).split("\t")[0],
    },
  };

  fs.writeFileSync(
    `${CONFIG.outputDir}/build-summary.json`,
    JSON.stringify(buildSummary, null, 2),
  );
  success("Build summary generated");

  // Final success message
  log("\n🎉 Production build completed successfully!", "green");
  log("\n📦 Build Details:", "blue");
  log(`   📁 Output directory: ${CONFIG.outputDir}/`);
  log(`   🌐 Domain: ${CONFIG.domain}`);
  log(`   🔗 API URL: ${CONFIG.apiUrl}`);
  log(`   📊 Total size: ${buildSummary.size.total}`);

  log("\n📋 Next Steps:", "yellow");
  log("   1. Upload the dist/ folder contents to your web server");
  log("   2. Configure environment variables in backend/.env");
  log("   3. Set up database connection");
  log("   4. Install Node.js dependencies on server: npm install --production");
  log("   5. Start the backend: npm start");
  log("   6. Configure web server (Apache/Nginx) to serve static files");
} catch (err) {
  error(`Build failed: ${err.message}`);
  process.exit(1);
}
