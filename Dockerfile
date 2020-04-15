FROM python:3
MAINTAINER he.amirhossein@gmail.com

RUN mkdir /code
WORKDIR /code
COPY . /code/
RUN pip install -r /code/requirements.txt
RUN chmod +x /code/start.sh
RUN apt update && apt-get install -y clang nodejs npm
#RUN apt update && apt-get install -y clang
WORKDIR /usr/lib/x86_64-linux-gnu/
RUN ln -s libclang-7.so.1 libclang.so
WORKDIR /code
RUN npm install -g npm@latest
RUN npm cache verify
RUN npm install
RUN npm install -g @angular/cli
CMD ["/code/start.sh"]
