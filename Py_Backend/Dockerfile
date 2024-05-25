# This Dockerfile sets up an Ubuntu 22.04 environment with Python 3.10 and ffmpeg.
# It installs all the dependencies specified in the requirements.txt file and exposes port 8000.
# Finally, it runs the server.py script with the command "echo y | python3 server.py".

FROM ubuntu:22.04 AS builder-image

ARG DEBIAN_FRONTEND=noninteractive

# Download Python3.10
RUN apt-get update && apt-get install --no-install-recommends -y python3.10 python3.10-dev python3.10-venv python3-pip python3-wheel build-essential git ffmpeg && \
	apt-get clean && rm -rf /var/lib/apt/lists/*

# create and activate virtual environment
# using final folder name to avoid path issues with packages
RUN python3.10 -m venv /home/myuser/venv
ENV PATH="/home/myuser/venv/bin:$PATH"

# Install PyTorch dependencies for GPU
RUN pip3 install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install all dependencies
COPY requirements.txt .

RUN pip3 install --no-cache-dir -r requirements.txt

COPY tts/requirements.txt .

RUN pip3 install --no-cache-dir -r requirements.txt



# create a new stage from the base image
FROM ubuntu:22.04 AS runner-image

RUN apt-get update && apt-get install --no-install-recommends -y python3.10 python3.10-venv ffmpeg && \
	apt-get clean && rm -rf /var/lib/apt/lists/*

#RUN useradd --create-home myuser
COPY --from=builder-image /home/myuser/venv /home/myuser/venv

RUN mkdir /home/myuser/code
WORKDIR /home/myuser/code
COPY . .

EXPOSE 8000

# make sure all messages always reach console
ENV PYTHONUNBUFFERED=1

# activate virtual environment
ENV VIRTUAL_ENV=/home/myuser/venv
ENV PATH="/home/myuser/venv/bin:$PATH"

CMD echo y | uvicorn pyServer:app --host 0.0.0.0 --port 8000