FROM ubuntu:latest
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.0.list
RUN apt-get update && apt-get install -y mongodb-org && apt-get install -y curl

RUN mkdir /nodejs && curl http://nodejs.org/dist/v0.10.29/node-v0.10.29-linux-x64.tar.gz | tar xvzf - -C /nodejs --strip-components=1
# Add Node.js installation to PATH, and set
# the current working directory to /app
# so future commands in this Dockerfile are easier to write
ENV PATH $PATH:/nodejs/bin

RUN mkdir -p /data/db

COPY . /

RUN npm install

RUN chmod +x /entry.sh

EXPOSE 34700

ENTRYPOINT ["/entry.sh"]
