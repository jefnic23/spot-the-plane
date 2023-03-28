FROM python:3.11

WORKDIR /api

COPY requirements.txt /api/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /api/requirements.txt

COPY /api /api

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]