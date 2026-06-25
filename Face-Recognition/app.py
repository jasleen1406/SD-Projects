import streamlit as st
import face_recognition
from PIL import Image, ImageDraw

st.title("Face Recognition Web App")

uploaded_file = st.file_uploader("Upload an image", type=["jpg", "png", "jpeg"])

if uploaded_file:
    image = face_recognition.load_image_file(uploaded_file)

    face_locations = face_recognition.face_locations(image)

    pil_image = Image.fromarray(image)
    draw = ImageDraw.Draw(pil_image)

    st.write(f"Found {len(face_locations)} face(s)")

    for i, (top, right, bottom, left) in enumerate(face_locations):
        draw.rectangle(((left, top), (right, bottom)), outline="red", width=3)

        st.write(f"Face {i+1}:")
        st.write(f"Top: {top}, Right: {right}, Bottom: {bottom}, Left: {left}")

    st.image(pil_image)