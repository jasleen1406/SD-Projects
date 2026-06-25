import face_recognition

img1 = face_recognition.load_image_file("tests/test_images/obama.jpg")
img2 = face_recognition.load_image_file("tests/test_images/biden.jpg")
enc1 = face_recognition.face_encodings(img1)[0]
enc2 = face_recognition.face_encodings(img2)[0]

result = face_recognition.compare_faces([enc1], enc2)

if result[0]:
    print("Same person")
else:
    print("Different person")