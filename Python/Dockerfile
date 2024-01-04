# This Dockerfile sets up an Ubuntu 22.04 environment with Python 3.11 and ffmpeg.
# It installs all the dependencies specified in the requirements.txt file and exposes port 8000.
# Finally, it runs the server.py script with the command "echo y | python3 server.py".

FROM ubuntu:22.04

# Create the app dir
WORKDIR /app
ADD . /app

# Install Python3.11 & ffmpeg
RUN apt-get -y update && apt-get install -y python3.10 \
ffmpeg \
python3-pip

# Install the python3-venv package
RUN apt-get install -y python3.10-venv

# Create a virtual environment
RUN python3 -m venv venv

# Activate the virtual environment
RUN . venv/bin/activate

# Install all dependencies
RUN pip3 install -r requirements.txt

# Install rvc dependencies
RUN pip3 install -r rvc/requirements.txt

# Expose port 8000
EXPOSE 8000

# Run the server, and accept all prompts
CMD echo y | python3 server.py