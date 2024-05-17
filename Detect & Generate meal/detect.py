from transformers import DetrImageProcessor, DetrForObjectDetection
import torch
from PIL import Image
import requests

# you can specify the revision tag if you don't want the timm dependency
processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-101", revision="no_timm")
model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-101", revision="no_timm")

def detect_ingredient(img_url):
    image = Image.open(requests.get(img_url, stream=True).raw)

    inputs = processor(images=image, return_tensors="pt")
    outputs = model(**inputs)

    # convert outputs (bounding boxes and class logits) to COCO API
    # let's only keep detections with score > 0.6
    target_sizes = torch.tensor([image.size[::-1]])
    results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=0.6)[0]

    detected_objects = []
    for label in results["labels"]:
        detected_objects.append(model.config.id2label[label.item()])

    return detected_objects