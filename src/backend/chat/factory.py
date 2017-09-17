import factory
from django.utils import timezone
from chat.models import Message

starting_seq_num = 1

class MessageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Message

    text = factory.Sequence(lambda n: "Message #{}".format(n))
    timestamp = factory.LazyFunction(timezone.now)

    @classmethod
    def _setup_next_sequence(cls):
        return starting_seq_num
