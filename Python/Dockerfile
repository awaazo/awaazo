# This Dockerfile sets up an Ubuntu 22.04 environment with Python 3.9 and ffmpeg.
# It installs all the dependencies specified in the requirements.txt file and exposes port 8000.
# Finally, it runs the server.py script with the command "echo y | python3 server.py".

FROM ubuntu:22.04

# Create the app dir
WORKDIR /app
ADD . /app

# Install Python3.9 & ffmpeg, pip, git, and python3-venv
RUN \
apt-get -y update && apt-get install -y python3.9 \
ffmpeg \
python3-pip \
git \
python3-venv

# Remove the apt cache
RUN apt-get clean \
&& rm -rf /var/lib/apt/lists/*

# Create a virtual environment and activate it
RUN python3 -m venv venv && . venv/bin/activate 

# Install PyTorch dependencies for GPU
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121 && pip cache purge


# Install all dependencies
RUN pip3 install -r requirements.txt && pip cache purge

# Install rvc dependencies
RUN pip3 install -r rvc_service/requirements.txt && pip cache purge

# Install text_to_speech dependencies
RUN pip3 install -r text_to_speech_service/requirements.txt && pip cache purge

# Expose port 8000
EXPOSE 8000

# Run the server, and accept all prompts
CMD echo y | python3 server.py