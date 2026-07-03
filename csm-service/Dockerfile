FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir fastapi uvicorn python-multipart pydantic

COPY main.py generator.py stt.py .

ENV CSM_MOCK=true
ENV PORT=8001

EXPOSE 8001

CMD ["python", "main.py"]
