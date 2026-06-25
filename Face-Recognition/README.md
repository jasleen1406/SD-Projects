# 👤 Face Recognition System

A Python-based facial analysis project built using **face_recognition**, **dlib**, **OpenCV**, **NumPy**, and **Pillow** for detecting, comparing, identifying, and modifying faces from images.

This project demonstrates practical computer vision workflows used in identity verification, surveillance systems, smart attendance, and photo editing applications.
## Features

#### Find faces in pictures

Find all the faces that appear in a picture:

![](https://cloud.githubusercontent.com/assets/896692/23625227/42c65360-025d-11e7-94ea-b12f28cb34b4.png)

```python
import face_recognition
image = face_recognition.load_image_file("your_file.jpg")
face_locations = face_recognition.face_locations(image)
```

#### Find and manipulate facial features in pictures

Get the locations and outlines of each person's eyes, nose, mouth and chin.

![](https://cloud.githubusercontent.com/assets/896692/23625282/7f2d79dc-025d-11e7-8728-d8924596f8fa.png)

```python
import face_recognition
image = face_recognition.load_image_file("your_file.jpg")
face_landmarks_list = face_recognition.face_landmarks(image)
```

Finding facial features is super useful for lots of important stuff. But you can also use it for really stupid stuff
like applying [digital make-up](https://github.com/ageitgey/face_recognition/blob/master/examples/digital_makeup.py) (think 'Meitu'):

![](https://cloud.githubusercontent.com/assets/896692/23625283/80638760-025d-11e7-80a2-1d2779f7ccab.png)

#### Identify faces in pictures

Recognize who appears in each photo.

![](https://cloud.githubusercontent.com/assets/896692/23625229/45e049b6-025d-11e7-89cc-8a71cf89e713.png)

```python
import face_recognition
known_image = face_recognition.load_image_file("biden.jpg")
unknown_image = face_recognition.load_image_file("unknown.jpg")

biden_encoding = face_recognition.face_encodings(known_image)[0]
unknown_encoding = face_recognition.face_encodings(unknown_image)[0]

results = face_recognition.compare_faces([biden_encoding], unknown_encoding)
```


## 🛠 Tech Stack

- Python 3.11  
- face_recognition  
- dlib  
- OpenCV  
- NumPy  
- Pillow  
- Click  
- setuptools  

---

## 📂 Project Structure

Face-Recognition/  
├── detect.py  
├── compare.py  
├── identify.py  
├── makeover.py  
├── app.py  
├── tests/  
│   └── test_images/  
├── scripts/  
│   └── run_api_demo.py  

---

## 🚀 Installation

Clone the repository:

git clone https://github.com/jasleen1406/SD-Projects.git  
cd Face-Recognition  

Create environment:

conda create -n faceenv python=3.11  
conda activate faceenv  

Install dependencies:

pip install face_recognition  
pip install pillow numpy click  
pip install git+https://github.com/ageitgey/face_recognition_models  
pip install "setuptools<81"  

---

## ▶️ Usage

Run face detection:

python detect.py  

Run face comparison:

python compare.py  

Run face identification:

python identify.py  

Run makeover:

python makeover.py  

Run web app:

python app.py  

---

## 📸 Functionalities

✅ Face detection with coordinates  
✅ Face comparison  
✅ Face identification  
✅ Facial landmark detection  
✅ Basic image makeover  
✅ Web interface support  

---

## 💡 Applications

- Smart attendance systems  
- Security surveillance  
- Identity verification  
- Photo editing tools  
- Human-computer interaction  
- Access control systems  

---

## 📈 Future Improvements

- Real-time webcam detection 🎥  
- Multi-face live recognition  
- Emotion detection 😄  
- Age estimation  
- Gender classification  
- Mask detection 😷  

---

## 👩‍💻 Author

**Jasleen Jassal**  
Built for Computer Vision and Software Development learning.
  [audreyr/cookiecutter-pypackage](https://github.com/audreyr/cookiecutter-pypackage) project template
  for making Python project packaging way more tolerable.
