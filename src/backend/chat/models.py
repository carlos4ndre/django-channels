from __future__ import unicode_literals

import json
from django.db import models
from django.utils import timezone


class Message(models.Model):
    text = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)

    def __unicode__(self):
        return "[{timestamp}]: {text}".format(**self.as_dict())

    @property
    def formatted_timestamp(self):
        return self.timestamp.strftime("%y-%m-%d %H:%M:%S")

    def as_dict(self):
        return {"text": self.text, "timestamp": self.formatted_timestamp}

    def to_json(self):
        return json.dumps(self.as_dict())
