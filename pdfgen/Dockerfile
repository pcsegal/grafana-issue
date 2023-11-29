FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN apt-get update \
    && apt-get install -y software-properties-common sudo \
    && sudo apt install -y \
       gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 \
       libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
       libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 \
       libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils \
       wget libgbm-dev \
    && rm -rf /var/lib/apt/lists/*

RUN PUPPETEER_CACHE_DIR=/home/node/.cache/puppeteer npm ci --omit=dev

RUN mkdir /tmp/pdf && chown node:node /tmp/pdf

# Bundle app source
COPY . .

USER node

CMD [ "node", "grafana_pdf.js" ]
