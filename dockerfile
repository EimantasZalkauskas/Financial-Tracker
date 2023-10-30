FROM python:3.11.3

RUN pip install requirements.txt

WORKDIR /app

ENV PORT 8080

