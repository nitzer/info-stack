FROM python:2.7
ADD . /infostack
WORKDIR /infostack
RUN pip install -r requirements.txt
