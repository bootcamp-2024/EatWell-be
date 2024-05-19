from detect import detect_ingredient, upload_image
from recipes_generate import generate_recipe
from pymongo import MongoClient
from fastapi import FastAPI, HTTPException
from bson import ObjectId
import json

app = FastAPI()
uri = ""
# thêm uri vào đây
client = MongoClient(uri)
db = client['Detect']
collectionImg = db.Image
collectionRec = db.Recipe

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/gen_recipes")
def gen_recipes(imgID: str):
    try:
        img_url = collectionImg.find_one({'_id': ObjectId(imgID)})['url']
        img_path = f"Image/{imgID}.jpg"
        ingredient = detect_ingredient(img_url, img_path)
        output_url = upload_image(img_path)

        recipes = generate_recipe(ingredient)
        
        result = collectionRec.insert_one({"img_url": output_url, "recipes": recipes})
        response = {"img_url": output_url, "recipes": recipes}
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# gen_recipes('6648ab9b4eeba4de7bb0d62e')