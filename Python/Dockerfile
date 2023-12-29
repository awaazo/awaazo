# This Dockerfile sets up an Ubuntu 22.04 environment with Python 3.11 and ffmpeg.
# It installs all the dependencies specified in the requirements.txt file and exposes port 8000.
# Finally, it runs the server.py script with the command "echo y | python3 server.py".

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

# Run the server, and accept all prompts
CMD echo y | python3 server.py