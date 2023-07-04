# もとになるOSを作成
FROM node:16.14.2-alpine

# 公開するポートの指定
# EXPOSE 3000

# 作業ディレクトリの指定（任意）
WORKDIR /communication

COPY ./communication/package*.json ./

RUN npm install

COPY ./communication /communication

COPY ./app ./communication

# サーバー立ち上げ時に実行されるコマンド(一つまで)
ENTRYPOINT ["npm", "run", "dev"]



