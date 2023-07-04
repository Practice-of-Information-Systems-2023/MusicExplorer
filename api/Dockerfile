FROM python:3.10
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/
EXPOSE 8000
# コンテナ起動時のコマンド実行
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
