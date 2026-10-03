FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

RUN pip install --no-cache-dir \
    ansible \
    kubernetes

COPY requirements.yml /tmp/requirements.yml

RUN ansible-galaxy collection install \
    -r /tmp/requirements.yml

WORKDIR /workspace

ENTRYPOINT ["ansible-playbook"]