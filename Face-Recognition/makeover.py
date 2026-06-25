from PIL import Image, ImageDraw
import face_recognition

# Load image
image = face_recognition.load_image_file("tests/test_images/biden.jpg")

# Detect landmarks
face_landmarks_list = face_recognition.face_landmarks(image)

# Convert to editable image
pil_image = Image.fromarray(image)
draw = ImageDraw.Draw(pil_image)

# Apply lipstick
for face_landmarks in face_landmarks_list:
    draw.polygon(face_landmarks["top_lip"], fill=(255, 0, 0))
    draw.polygon(face_landmarks["bottom_lip"], fill=(255, 0, 0))

# Save result
pil_image.save("makeover_output.jpg")

print("Makeover complete. Check makeover_output.jpg")