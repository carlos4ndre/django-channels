from django.conf.urls import url
from chat import views

urlpatterns = [
    url(r'^', views.FrontendAppView.as_view()),
]
