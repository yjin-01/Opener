# PM2 
apt -y update && apt -y upgrade
curl -sL https://deb.nodesource.com/setup_18.x |  bash -
apt install -y nodejs
npm install
npm ci
npm install pm2 -g
npm run build
npm run start:prod