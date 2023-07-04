FROM python:latest
RUN mkdir /bat
COPY ./requirements.txt /bat
WORKDIR /bat
RUN apt-get update \ 
    && apt-get install -y cron
RUN echo "1 * * * * python3 /bat/src/set_position.py >> /bat/bat.log" >> /etc/crontabs/root \
    && crontab /var/spool/crontab/root

ARG UID=1000
RUN useradd -m -u ${UID} docker
USER ${UID}
RUN pip3 install --upgrade pip \
    && pip install -r requirements.txt


