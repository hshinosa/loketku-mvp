#!/bin/bash
# Deploy Loketku to VPS

set -e

VPS_HOST="${VPS_HOST:-}"
VPS_USER="${VPS_USER:-}"
VPS_PATH="${VPS_PATH:-/var/www/loketku}"

if [ -z "$VPS_HOST" ] || [ -z "$VPS_USER" ]; then
  echo "Error: VPS_HOST and VPS_USER environment variables must be set"
  echo "Usage: VPS_HOST=your-vps-ip VPS_USER=root ./scripts/deploy-vps.sh"
  exit 1
fi

echo "Building application..."
npm run build

echo "Creating deployment archive..."
TEMP_DIR=$(mktemp -d)
cp -r dist package.json package-lock.json $TEMP_DIR/
cp -r scripts $TEMP_DIR/ 2>/dev/null || true
cp DEPLOYMENT.md $TEMP_DIR/ 2>/dev/null || true

# Create systemd service file
cat > $TEMP_DIR/loketku.service << 'EOF'
[Unit]
Description=Loketku Astro App
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/loketku
ExecStart=/usr/bin/node dist/server/entry.mjs
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=DATABASE_PATH=/var/www/loketku/data/loketku.db

# Security
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

# Create nginx config template
cat > $TEMP_DIR/loketku.nginx << 'EOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

cd $TEMP_DIR
tar -czf loketku-deploy.tar.gz *

echo "Uploading to VPS..."
scp loketku-deploy.tar.gz ${VPS_USER}@${VPS_HOST}:${VPS_PATH}/

echo "Running remote setup..."
ssh ${VPS_USER}@${VPS_HOST} << 'ENDSSH'
  cd /var/www/loketku
  tar -xzf loketku-deploy.tar.gz
  rm loketku-deploy.tar.gz
  
  npm ci --production
  
  # Setup data directory
  mkdir -p data
  chown -R www-data:www-data /var/www/loketku
  
  # Install systemd service
  cp loketku.service /etc/systemd/system/
  systemctl daemon-reload
  systemctl enable loketku
  systemctl restart loketku
  
  echo "Deployment complete!"
  systemctl status loketku --no-pager
ENDSSH

# Cleanup
rm -rf $TEMP_DIR

echo "✅ Deployment to VPS complete!"
