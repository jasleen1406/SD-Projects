import face_recognition

image = face_recognition.load_image_file("tests/test_images/obama.jpg")

face_locations = face_recognition.face_locations(image)

print(f"Found {len(face_locations)} face(s)")

for i, (top, right, bottom, left) in enumerate(face_locations):
    print(f"Face {i+1}: Top={top}, Right={right}, Bottom={bottom}, Left={left}")