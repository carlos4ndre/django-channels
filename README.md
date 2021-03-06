[![Travis build](https://secure.travis-ci.org/carlos4ndre/django-channels.svg?branch=master
"Build Status")](https://travis-ci.org/carlos4ndre/django-channels)
<a href="https://codeclimate.com/github/carlos4ndre/django-channels"><img src="https://codeclimate.com/github/carlos4ndre/django-channels/badges/gpa.svg" /></a>
<a href="https://codeclimate.com/github/carlos4ndre/django-channels"><img src="https://codeclimate.com/github/carlos4ndre/django-channels/badges/issue_count.svg" /></a>

# django-channels
A simple web chat built with Django Channels + ReactJS


## How to run the app?

With docker you just need to run this command:
```
$ docker-compose -f docker-compose-{dev|prod}.yml up --build
```

## How does it work?

The app is composed by 2 parts:
- frontend: react app that communicates with the backend
via websockets, using both http and ws channels on django side.

- backend: django app running on port 8000, that uses channels
feature, great for real-time apps using websockets.

Nginx was used as reverse proxy, and it's the entrypoint for
the app, available at `http://localhost`.

In case you're using the development environment, then
you can also access `http://localhost:3000` to develop
the frontend part, which is very handy as it provides
hot reload and on the fly linting messages!
