# Deployment Guide

This guide covers deployment strategies, configuration, and best practices for the GGcode Compiler application.

## 🚀 Quick Start Deployment

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- GGcode native library (`libggcode.so`)
- Reverse proxy (nginx/Apache) for production

### Basic Production Deployment

```bash
# 1. Clone and setup
git clone <repository-url>
cd ggcode-compiler
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with production settings

# 3. Build and test
npm run build

# 4. Start production server
npm start
```

## 🔧 Environment Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Server Configuration
NODE_ENV=production
PORT=6990
HOST=0.0.0.0

# Compiler Configuration
COMPILER_LIB_PATH=/path/to/libggcode.so
COMPILER_TIMEOUT=15000

# Security Configuration
TRUST_PROXY=true
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Logging Configuration
LOG_LEVEL=info
LOG_FORMAT=combined

# Static Files Configuration
STATIC_CACHE_MAX_AGE=86400
```

### Configuration Validation

The application validates required configuration on startup:

```javascript
// Required configuration paths
const required = [
  'server.port',
  'server.host', 
  'compiler.libPath',
  'paths.examples',
  'paths.helpContent',
  'paths.views'
];
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:16-alpine

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Copy native library
COPY libggcode.so /usr/src/app/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S ggcode -u 1001

# Change ownership
RUN chown -R ggcode:nodejs /usr/src/app
USER ggcode

# Expose port
EXPOSE 6990

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:6990/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  ggcode-compiler:
    build: .
    ports:
      - "6990:6990"
    environment:
      - NODE_ENV=production
      - PORT=6990
      - HOST=0.0.0.0
      - COMPILER_LIB_PATH=/usr/src/app/libggcode.so
    volumes:
      - ./GGCODE:/usr/src/app/GGCODE:ro
      - ./public/data:/usr/src/app/public/data:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6990/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - ggcode-compiler
    restart: unless-stopped
```

### Build and Run

```bash
# Build image
docker build -t ggcode-compiler .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f ggcode-compiler

# Scale application
docker-compose up -d --scale ggcode-compiler=3
```

## 🌐 Reverse Proxy Configuration

### Nginx Configuration

```nginx
upstream ggcode_backend {
    server 127.0.0.1:6990;
    # Add more servers for load balancing
    # server 127.0.0.1:6991;
    # server 127.0.0.1:6992;
}

server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Static Files
    location /static/ {
        alias /path/to/ggcode-compiler/public/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API Routes
    location /api/ {
        proxy_pass http://ggcode_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Main Application
    location / {
        proxy_pass http://ggcode_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health Check
    location /health {
        access_log off;
        proxy_pass http://ggcode_backend/api/health;
    }
}
```

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    
    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /path/to/ssl/cert.pem
    SSLCertificateKeyFile /path/to/ssl/private.key
    
    # Security Headers
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    
    # Compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
    
    # Proxy Configuration
    ProxyPreserveHost On
    ProxyPass /api/ http://127.0.0.1:6990/api/
    ProxyPassReverse /api/ http://127.0.0.1:6990/api/
    ProxyPass / http://127.0.0.1:6990/
    ProxyPassReverse / http://127.0.0.1:6990/
</VirtualHost>
```

## 🔄 Process Management

### PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'ggcode-compiler',
    script: 'src/server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 6990,
      HOST: '0.0.0.0'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 6990,
      HOST: '0.0.0.0',
      COMPILER_LIB_PATH: '/opt/ggcode/libggcode.so'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### PM2 Commands

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js --env production

# Monitor processes
pm2 monit

# View logs
pm2 logs ggcode-compiler

# Restart application
pm2 restart ggcode-compiler

# Stop application
pm2 stop ggcode-compiler

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### Systemd Service

Create `/etc/systemd/system/ggcode-compiler.service`:

```ini
[Unit]
Description=GGcode Compiler Application
After=network.target

[Service]
Type=simple
User=ggcode
WorkingDirectory=/opt/ggcode-compiler
ExecStart=/usr/bin/node src/server/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=6990
Environment=HOST=0.0.0.0
Environment=COMPILER_LIB_PATH=/opt/ggcode/libggcode.so

# Security settings
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
ReadWritePaths=/opt/ggcode-compiler

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable ggcode-compiler
sudo systemctl start ggcode-compiler

# Check status
sudo systemctl status ggcode-compiler

# View logs
sudo journalctl -u ggcode-compiler -f
```

## 📊 Monitoring and Logging

### Health Checks

The application provides a health check endpoint:

```bash
# Check application health
curl -f http://localhost:6990/api/health

# Response format
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "version": "1.0.0"
}
```

### Logging Configuration

Configure logging levels by environment:

```javascript
// Development
{
  logging: {
    level: 'debug',
    format: 'dev'
  }
}

// Production
{
  logging: {
    level: 'info',
    format: 'combined'
  }
}
```

### Log Rotation

Configure logrotate for application logs:

```bash
# /etc/logrotate.d/ggcode-compiler
/opt/ggcode-compiler/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ggcode ggcode
    postrotate
        pm2 reloadLogs
    endscript
}
```

## 🔒 Security Considerations

### File Permissions

```bash
# Set proper ownership
sudo chown -R ggcode:ggcode /opt/ggcode-compiler

# Set file permissions
find /opt/ggcode-compiler -type f -exec chmod 644 {} \;
find /opt/ggcode-compiler -type d -exec chmod 755 {} \;

# Make scripts executable
chmod +x /opt/ggcode-compiler/src/server/index.js

# Secure native library
chmod 755 /opt/ggcode/libggcode.so
```

### Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 6990/tcp   # Block direct access to app
sudo ufw enable

# iptables
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -A INPUT -p tcp --dport 6990 -s 127.0.0.1 -j ACCEPT
iptables -A INPUT -p tcp --dport 6990 -j DROP
```

### SSL/TLS Configuration

```bash
# Generate SSL certificate with Let's Encrypt
sudo certbot --nginx -d your-domain.com

# Or use existing certificates
sudo cp your-cert.pem /etc/ssl/certs/
sudo cp your-key.pem /etc/ssl/private/
sudo chmod 644 /etc/ssl/certs/your-cert.pem
sudo chmod 600 /etc/ssl/private/your-key.pem
```

## 🚀 Performance Optimization

### Node.js Optimization

```bash
# Increase memory limit
node --max-old-space-size=2048 src/server/index.js

# Enable garbage collection logging
node --trace-gc src/server/index.js

# Use production optimizations
NODE_ENV=production node src/server/index.js
```

### Caching Strategy

```javascript
// Application-level caching
const cache = new Map();

// Redis caching (optional)
const redis = require('redis');
const client = redis.createClient();

// Static file caching
app.use(express.static('public', {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
  etag: true
}));
```

### Database Optimization (if applicable)

```javascript
// Connection pooling
const pool = {
  min: 2,
  max: 10,
  acquireTimeoutMillis: 60000,
  idleTimeoutMillis: 30000
};
```

## 📈 Scaling Strategies

### Horizontal Scaling

```bash
# Multiple instances with PM2
pm2 start ecosystem.config.js -i max

# Load balancer configuration
upstream ggcode_backend {
    least_conn;
    server 127.0.0.1:6990 weight=1 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:6991 weight=1 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:6992 weight=1 max_fails=3 fail_timeout=30s;
}
```

### Vertical Scaling

```bash
# Increase server resources
# - CPU: More cores for better concurrency
# - RAM: More memory for larger compilations
# - Storage: SSD for faster I/O operations
```

## 🔄 Backup and Recovery

### Application Backup

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backup/ggcode-compiler"
APP_DIR="/opt/ggcode-compiler"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p "$BACKUP_DIR/$DATE"

# Backup application files
tar -czf "$BACKUP_DIR/$DATE/app.tar.gz" -C "$APP_DIR" .

# Backup configuration
cp /etc/systemd/system/ggcode-compiler.service "$BACKUP_DIR/$DATE/"
cp /etc/nginx/sites-available/ggcode-compiler "$BACKUP_DIR/$DATE/"

# Cleanup old backups (keep 30 days)
find "$BACKUP_DIR" -type d -mtime +30 -exec rm -rf {} \;
```

### Recovery Process

```bash
#!/bin/bash
# restore.sh

BACKUP_DATE=$1
BACKUP_DIR="/backup/ggcode-compiler/$BACKUP_DATE"
APP_DIR="/opt/ggcode-compiler"

if [ -z "$BACKUP_DATE" ]; then
    echo "Usage: $0 <backup_date>"
    exit 1
fi

# Stop application
sudo systemctl stop ggcode-compiler

# Restore application files
sudo rm -rf "$APP_DIR"
sudo mkdir -p "$APP_DIR"
sudo tar -xzf "$BACKUP_DIR/app.tar.gz" -C "$APP_DIR"

# Restore configuration
sudo cp "$BACKUP_DIR/ggcode-compiler.service" /etc/systemd/system/
sudo cp "$BACKUP_DIR/ggcode-compiler" /etc/nginx/sites-available/

# Reload and start services
sudo systemctl daemon-reload
sudo systemctl start ggcode-compiler
sudo nginx -t && sudo systemctl reload nginx
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Find process using port
sudo lsof -i :6990
sudo netstat -tulpn | grep :6990

# Kill process
sudo kill -9 <PID>
```

#### 2. Native Library Issues

```bash
# Check library exists and permissions
ls -la /path/to/libggcode.so

# Check library dependencies
ldd /path/to/libggcode.so

# Set library path
export LD_LIBRARY_PATH=/path/to/lib:$LD_LIBRARY_PATH
```

#### 3. Memory Issues

```bash
# Monitor memory usage
htop
free -h

# Check Node.js memory usage
node --inspect src/server/index.js
# Open chrome://inspect in Chrome
```

#### 4. SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in /path/to/cert.pem -text -noout

# Test SSL configuration
openssl s_client -connect your-domain.com:443

# Renew Let's Encrypt certificate
sudo certbot renew
```

### Log Analysis

```bash
# Application logs
tail -f /opt/ggcode-compiler/logs/combined.log

# System logs
sudo journalctl -u ggcode-compiler -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PM2 logs
pm2 logs ggcode-compiler --lines 100
```

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] Code tested and reviewed
- [ ] Dependencies updated and audited
- [ ] Configuration validated
- [ ] SSL certificates ready
- [ ] Backup strategy in place
- [ ] Monitoring configured

### Deployment

- [ ] Application deployed
- [ ] Services started and enabled
- [ ] Reverse proxy configured
- [ ] SSL/TLS configured
- [ ] Firewall rules applied
- [ ] Health checks passing

### Post-Deployment

- [ ] Application accessible
- [ ] All features working
- [ ] Performance metrics normal
- [ ] Logs being generated
- [ ] Monitoring alerts configured
- [ ] Documentation updated

---

This deployment guide provides comprehensive instructions for deploying the GGcode Compiler in various environments, from simple single-server deployments to complex, scalable production environments.