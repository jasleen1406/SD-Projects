#!/usr/bin/env python3
"""Demo runner that exercises core face_recognition functions on test images."""
import os
import sys
from pprint import pprint

repo_root = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, repo_root)

try:
    import face_recognition
except Exception as e:
    print("Failed to import face_recognition:", e)
    raise

TEST_IMAGES_DIR = os.path.join(repo_root, 'tests', 'test_images')
OBAMA = os.path.join(TEST_IMAGES_DIR, 'obama.jpg')
BIDEN = os.path.join(TEST_IMAGES_DIR, 'biden.jpg')

print('Loading images...')
img_obama = face_recognition.load_image_file(OBAMA)
img_biden = face_recognition.load_image_file(BIDEN)
print('Shapes:', img_obama.shape, img_biden.shape)

print('\nDetecting face locations (hog) in obama.jpg...')
locs = face_recognition.face_locations(img_obama)
print('Found locations:', locs)

print('\nDetecting landmarks (large) for obama.jpg...')
landmarks = face_recognition.face_landmarks(img_obama)
print('Landmark keys:', list(landmarks[0].keys()) if landmarks else None)

print('\nComputing face encodings...')
enc_obama = face_recognition.face_encodings(img_obama)
enc_biden = face_recognition.face_encodings(img_biden)
print('Encodings lengths:', [len(e) for e in enc_obama], [len(e) for e in enc_biden])

if enc_obama and enc_biden:
    e1 = enc_obama[0]
    e2 = enc_biden[0]
    print('\nComparing faces:')
    dist = face_recognition.face_distance([e2], e1)
    print('Distance (obama vs biden):', dist)
    print('Match (tolerance 0.6):', face_recognition.compare_faces([e2], e1))

print('\nBatch face locations using CNN (if available) on 3 duplicates of obama...')
images = [img_obama, img_obama, img_obama]
try:
    batched = face_recognition.batch_face_locations(images, number_of_times_to_upsample=0, batch_size=3)
    print('Batched results count:', len(batched))
except Exception as e:
    print('Batch face locations failed (likely no cnn/dlib GPU support):', e)

print('\nDemo complete.')
