# Deploy Frontend and Backend to GitHub

## Current Status

✅ **Frontend**: Located in `/frontend/` folder
✅ **Backend**: Located in `/backend/` folder  
✅ **Root Package.json**: Manages both projects as workspaces

## Push Both Folders to GitHub

### Step 1: Commit and Push Current Changes

```bash
# Check current status
git status

# Add any uncommitted files
git add .

# Commit the restructured project
git commit -m "Restructure project: separate frontend and backend folders

- Move React app to frontend/ directory
- Keep Node.js API in backend/ directory
- Add workspace configuration for unified management
- Update documentation and setup scripts"

# Push to GitHub
git push origin main
```

### Step 2: Verify on GitHub

After pushing, you should see this structure on GitHub:

```
your-repo/
├── frontend/           # React + TypeScript frontend
│   ├── src/           # All React components
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── ...
├── backend/           # Node.js + Express backend
│   ├── src/           # API routes, models
│   ├── package.json   # Backend dependencies
│   └── ...
├── package.json       # Root workspace config
├── README.md          # Setup documentation
└── ...
```

## If GitHub Still Shows Only Backend

This might happen if:

1. **Large files**: Frontend node_modules might be too large
2. **Git LFS**: Large files need Git LFS
3. **Push failed**: Check for errors during git push

### Solution 1: Check Push Status

```bash
# Check if push was successful
git log --oneline -5

# Check remote status
git remote -v

# Force push if needed (use carefully)
git push -f origin main
```

### Solution 2: Remove node_modules and Push

```bash
# Remove large node_modules directories
rm -rf frontend/node_modules backend/node_modules

# Add changes
git add .
git commit -m "Remove node_modules directories"
git push origin main
```

### Solution 3: Create .gitignore

Ensure `.gitignore` excludes large files:

```bash
# Check if .gitignore is working
git status

# node_modules should not appear in git status
# If they do, add them to .gitignore
```

## Development URLs

### Frontend

- **Local**: http://localhost:8080/
- **Network**: Available on local network

### Backend

- **Local**: http://localhost:5000/
- **Health Check**: http://localhost:5000/health

## Quick Setup for New Contributors

```bash
# Clone repository
git clone <your-repo-url>
cd your-repo

# Install all dependencies
npm run install:all

# Configure environment
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Start both servers
npm run dev
```

## Troubleshooting URLs

### Frontend Not Loading

1. Check if Vite server is running on port 8080
2. Verify no other services are using the port
3. Check browser console for errors

### Backend Not Responding

1. Ensure MongoDB is running
2. Check backend/.env configuration
3. Verify backend server is running on port 5000

### Port Conflicts

```bash
# Check what's running on ports
netstat -an | grep :3000
netstat -an | grep :5000
netstat -an | grep :8080

# Kill processes if needed
killall node
```

## Next Steps

1. ✅ Push code to GitHub with both folders
2. ✅ Update repository description
3. ✅ Configure GitHub Actions (optional)
4. ✅ Set up deployment pipelines
5. ✅ Configure environment variables for production
