

from time import sleep
from django.http import HttpRequest, HttpResponse, JsonResponse
from flask import jsonify
from django.shortcuts import render,redirect
import json
import cv2 as cv
import cv2
import base64
from django.templatetags.static import static
from django.views.generic import View
import joblib
from django.views.decorators.csrf import csrf_exempt

from django.template import loader

import numpy as np
from requests import Response
from urllib3 import HTTPResponse
from .wavelet import w2d



__class_name_to_number = {}
__class_number_to_name = {}

__model = None

def home(request):  
    data = json.load(open('static/cols.json'))['data_columns']

    locations = json.load(open("static/cols.json") )

    return render(request, 'index.html' , {'locations': locations['data_columns'][3:],'result' : 0})


# custom method for generating predictions
def getPredictions(location ,total_sqft ,  bath , BHK ):
    import pickle
    model = pickle.load(open('templates/banglore_home_prices_model.pickle', "rb"))

    data = json.load(open('static/cols.json'))['data_columns']
    x = np.zeros(len(data))

    loc_index = data.index(location)

    x[0] = total_sqft
    x[1] = bath
    x[2] = BHK
    x[loc_index] = 1


    pred = model.predict([x])
    return str(f"₹:{round(pred[0] , 2)}")
    # return x1
    

# our result page view
def result(request):
    location =  request.POST.get("location")
    tsqft =  request.POST.get('total_sqft')
    bath =  request.POST.get('bath')
    BHK =  request.POST.get('bhk')
    # fields = [location , tsqft , bath , BHK]
    fields= {
        'Location' : location , 
        'Total sqft' : tsqft,
        'Bathrooms' : bath,
        'BHK' : BHK
    }
    result = getPredictions(location ,tsqft ,  bath , BHK )
    locations = json.load(open("static/cols.json") )
    print(location , tsqft , bath , BHK)

    return render(request, 'index.html', {
        'locations': locations['data_columns'][3:],
         'result' : jsonify(result).headers.add('Access-Control-Allow-Origin', '*'),
         'fields':fields.items(),
    })



def image_page(request):
   
    if request.method == "GET"  : 
        # result = classify('model/dataset/lionel_messi/5cb62e40230000c2006db3ac.jpg')
        # print('get_method')
        context = {
            'result' : "getting"
        }

        return render(request, 'classfier.html' ,context)

    if request.method == "POST" : 


        image_data =request.POST
        try :
            method = image_data['image_data']
            new_image = get_cv2_image_from_base64_string(method)
            image_name = "static/saved_images/saved_image.jpg" 
            cv2.imwrite(image_name,new_image)
            # print('new image is ' , new_image)
            result = classify(image_name)
            print('Classify Result is : ' , result)

            return JsonResponse({
                'image_data' : result,
            })

        except Exception as e :   
            return JsonResponse({ 
                'image_data' : str('Error when Classifiying Report'),
            })
        
       
        

def classify(image):
    load_artifacts()
    print('image_cropping')
    imgs = get_cropped_image_if_2_eyes(image)
    result = []
    
    for img in imgs:
        scalled_raw_img = cv2.resize(img, (32, 32))
        img_har = w2d(img , 'db1' , 5)

        scalled_img_har = cv2.resize(img_har , (32,32))
        cv2.imwrite(f'static/images/har.jpg' , img_har)


        combined_vstack = np.vstack((scalled_raw_img.reshape(32*32*3 , 1) ,scalled_img_har.reshape(32*32 , 1)) )
        len_img_array = 32*32*3 + 32*32
        final = combined_vstack.reshape(1,len_img_array)
        prediction = __model.predict(final)

        result.append({
            'prediction' : __class_number_to_name[prediction[0]],
            'probability' : np.around(__model.predict_proba(final)*100,2).tolist()[0],
            'dictionary': __class_number_to_name
            })

    return result

def get_cv2_image_from_base64_string(b64str):
    '''
    credit: https://stackoverflow.com/questions/33754935/read-a-base-64-encoded-image-from-memory-using-opencv-python-library
    :param uri:
    :return:
    '''
    try:
        encoded_data = b64str.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except:
        return b64str
    else :
        print ("Functoin gone worng")
        

    


def get_cropped_image_if_2_eyes(image_path):
    face_cascade = cv2.CascadeClassifier('model/haarcascades/haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier('model/haarcascades/haarcascade_eye.xml')

    if image_path:
        img = cv2.imread(image_path)
    else: 
        base64_image = image_to_base64()
        img = get_cv2_image_from_base64_string(base64_image)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.2, 5)

    cropped_faces = []
    for (x,y,w,h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            roi_color = img[y:y+h, x:x+w]
            eyes = eye_cascade.detectMultiScale(roi_gray)
            if len(eyes) >= 2:
                cropped_faces.append(roi_color)
    return cropped_faces


def load_artifacts():

    print("loading saved artifacts...start")
    global __class_name_to_number
    global __class_number_to_name

    with open('static/artifacts/class_dict.json' ,'rb') as f:
        __class_name_to_number = json.load(f)
        __class_number_to_name = {v:k for k,v in __class_name_to_number.items()}


    global __model 
    with open("static/artifacts/image_classifier_model.pickle", "rb") as f:
            __model = joblib.load(f)
    print("loading saved artifacts...done")


def image_to_base64():
    with open('static/base64.txt') as f:
        return f.read()


