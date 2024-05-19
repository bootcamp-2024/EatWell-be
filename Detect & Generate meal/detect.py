from transformers import DetrImageProcessor, DetrForObjectDetection
import torch
from PIL import Image, ImageDraw
import requests
import cloudinary.uploader

# you can specify the revision tag if you don't want the timm dependency
processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-101", revision="no_timm")
model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-101", revision="no_timm")

def detect_ingredient(img_url, output_path):
    image = Image.open(requests.get(img_url, stream=True).raw)

    inputs = processor(images=image, return_tensors="pt")
    outputs = model(**inputs)

    # convert outputs (bounding boxes and class logits) to COCO API
    # let's only keep detections with score > 0.6
    target_sizes = torch.tensor([image.size[::-1]])
    results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=0.6)[0]

    detected_objects = []
    draw = ImageDraw.Draw(image)
    
    for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
        detected_objects.append(model.config.id2label[label.item()])
        box = [round(i, 2) for i in box.tolist()]
        draw.rectangle(box, outline="red", width=3)
        draw.text((box[0], box[1]), f"{model.config.id2label[label.item()]} {round(score.item(), 3)}", fill="red")

    image.save(output_path)
    # print(detected_objects)
    print(f"Image {output_path} done!")
    
    return detected_objects

def upload_image(img_path):
    # Configure Cloudinary
    cloudinary.config(
        cloud_name = "",
        api_key = "",
        api_secret = ""
        # thêm thông tin config
    )

    # Upload the image to Cloudinary
    response = cloudinary.uploader.upload(img_path)
    default_url = "https://static.thenounproject.com/png/4974686-200.png"

    if response:
        return response['secure_url']
     
    return default_url
