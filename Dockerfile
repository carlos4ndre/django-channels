FROM alpine:3.6

# Install base dependencies
RUN apk add --update build-base postgresql-dev

# Install python 3
RUN apk add --no-cache python3 python3-dev && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --upgrade pip setuptools && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
    rm -r /root/.cache

# Install yarn
RUN apk add yarn

# Install npm
RUN apk add nodejs nodejs-npm

# Setup Django
RUN mkdir /app
WORKDIR /app
ADD src/backend /app/
RUN pip install -r requirements.txt

# Build react app
ADD src/frontend /tmp/frontend
RUN cd /tmp/frontend && npm install && yarn run build
RUN mkdir /app/frontend
RUN cp -fr /tmp/frontend/build /app/frontend
