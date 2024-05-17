from detect import detect_ingredient
from recipes_generate import generate_recipe
from fastapi import FastAPI
import json

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/gen_recipes")
def gen_recipes():
    img_url = 'https://m.media-amazon.com/images/I/71A+zv1sxhL._AC_UF1000,1000_QL80_.jpg'
    ingredient = detect_ingredient(img_url)
    reponse = generate_recipe(ingredient)
    return reponse

# # Lưu kết quả vào file JSON
# with open("output.json", "w", encoding="utf-8") as json_file:
#     json.dump(recipes, json_file, ensure_ascii=False, indent=4)