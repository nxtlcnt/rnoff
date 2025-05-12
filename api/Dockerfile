FROM python:3.10-alpine

WORKDIR /app

RUN apk add --no-cache gcc g++ musl-dev libffi-dev git

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8002
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8002", "main:app"]
