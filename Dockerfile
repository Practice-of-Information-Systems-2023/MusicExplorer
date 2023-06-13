# もとになるOSを作成
FROM ubuntu:latest

# 必要なパッケージのインストール
RUN pip install numpy

# サーバー立ち上げ時に実行されるコマンド(一つまで)
ENTRYPOINT ["/bin/tini"]

# 公開するポートの指定
EXPOSE 80

# 作業ディレクトリの指定（任意）
WORKDIR /app

# ソースコードの追加(一つ上で指定した作業フォルダにローカルのパソコンの/appをコピーしている)
COPY . /app

# 環境変数の設定（必要な場合）
ENV variable_name=value