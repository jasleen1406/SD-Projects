import face_recognition

# Load known images
biden_image = face_recognition.load_image_file("tests/test_images/biden.jpg")
obama_image = face_recognition.load_image_file("tests/test_images/obama.jpg")

# Encode known faces
biden_encoding = face_recognition.face_encodings(biden_image)[0]
obama_encoding = face_recognition.face_encodings(obama_image)[0]

known_encodings = [biden_encoding, obama_encoding]
known_names = ["Joe Biden", "Barack Obama"]

# Load unknown image
unknown_image = face_recognition.load_image_file("tests/test_images/obama2.jpg")
unknown_encoding = face_recognition.face_encodings(unknown_image)[0]

# Compare
results = face_recognition.compare_faces(known_encodings, unknown_encoding)

for i, match in enumerate(results):
    if match:
        print("Picture contains:", known_names[i])