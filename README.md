[![Travis build](https://secure.travis-ci.org/carlos4ndre/django-channels.svg?branch=master
"Build Status")](https://travis-ci.org/carlos4ndre/django-channels)
<a href="https://codeclimate.com/github/carlos4ndre/django-channels"><img src="https://codeclimate.com/github/carlos4ndre/django-channels/badges/gpa.svg" /></a>
<a href="https://codeclimate.com/github/carlos4ndre/django-channels"><img src="https://codeclimate.com/github/carlos4ndre/django-channels/badges/issue_count.svg" /></a>

# django-channels
A simple web chat built with Django Channels + ReactJS


## How to run the app?

You can either use docker or go the hard way.

With docker you just need to run this command:
```
$ docker-compose up --build
```

With the die hard III way you have to install all dependencies and
run both the frontend and backend separately.
Assuming you're running on Mac OSX, follow these steps:

1) Install base dependencies
```
$ brew install redis python3 yarn node
$ pip install virtualenv
```

2) Setup backend
```
$ cd src/backend
$ python3 -m venv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
$ ./manage.py makemigrations chat
$ ./manage.py migrate
$ ./manage.py runserver
```

3) Setup frontend
```
$ cd src/frontend
$ npm install # ☕️ 🕑
$ yarn start
```

## How does it work?

The app is composed by 2 parts:
- frontend: react app that communicates with the backend
via websockets, using both http and ws channels on django side.

- backend: django app running on port 8000, that uses channels
feature, great for real-time apps using websockets.

The react app is served by a nodejs instance, so you will need
to access the it on http://localhost:3000
