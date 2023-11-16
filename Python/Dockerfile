FROM ubuntu:22.04

# Create the app dir
WORKDIR /app
ADD . /app

# Install Python3.11 & ffmpeg
RUN apt-get -y update && apt-get install -y python3.11 \
ffmpeg \
python3-pip

# Install all dependencies
RUN pip3 install -r requirements.txt

# Expose port 8000
EXPOSE 8000

ENTRYPOINT ["python3","server.py"]