FROM node:latest

# RUN apt-get update && \
#     apt-get install -y build-essential && \
#     apt-get install -y libvips libvips-dev libcairo2-dev libjpeg-dev libpng-dev libgif-dev && \
#     apt-get install -y curl

# RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
# RUN apt-get install -y nodejs

# RUN npm install --unsafe-perm -g sharp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"] 