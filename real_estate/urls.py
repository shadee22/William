"""real_estate URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.urls import path , include
from real_estate import views
from django.conf.urls.static import static

app_name = "my_app"
urlpatterns = [
    path('admin/', admin.site.urls),
    # add these to configure our home page (default view) and result web page
    path('', views.home, name='home'),
    path('william_prediction/', views.result, name='result'),
    path('image/' , views.image_page , name="classifier"),
    path('william_classifier/' , views.image_page , name="classifier"),
    # path('upload/' , views.image_upload , name="image_upload"),
    path('saving_names/' , views.saving_names , name='saving'),
    path('test_unit/' , views.test_unit , name='test'),
    path('all_names/' , views.all_names , name='all'),
    path('delete_all/' , views.delete_all , name='delete_all'),
    
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)