# もとになるOSを作成
FROM --platform=linux/amd64 node:20

# # 必要なパッケージのインストール
# RUN pip install numpy

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /sbin/tini
RUN chmod +x /sbin/tini

# # サーバー立ち上げ時に実行されるコマンド(一つまで)
# ENTRYPOINT ["/bin/tini"]

# 公開するポートの指定
EXPOSE 3000

# 作業ディレクトリの指定（任意）
WORKDIR /communication

COPY package*.json ./

RUN npm install 

# ソースコードの追加(一つ上で指定した作業フォルダにローカルのパソコンの/appをコピーしている)
COPY . /communication

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "node", "server.js"]

# # 環境変数の設定（必要な場合）
# ENV variable_name=value