import face_recognition

# Load image
image = face_recognition.load_image_file("tests/test_images/biden.jpg")

# Detect landmarks
face_landmarks_list = face_recognition.face_landmarks(image)

print("Found {} face(s)".format(len(face_landmarks_list)))

for face_landmarks in face_landmarks_list:
    for facial_feature in face_landmarks.keys():
        print(f"{facial_feature}: {face_landmarks[facial_feature]}")