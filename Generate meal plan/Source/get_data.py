import json
from bson import json_util
from pymongo import MongoClient

uri = ""
# thêm uri vào đây
client = MongoClient(uri)
db = client['EatWell']

# Đọc dữ liệu từ tệp JSON của bảng nguyên liệu
def get_ingredient_data():
    collectionIng = db.Ingredient
    return {ingredient['_id']: ingredient for ingredient in collectionIng.find()}

# Đọc dữ liệu từ tệp JSON của các công thức recipe
def get_recipe_data():
    # with open('../Data/EatWell.Recipe.json', 'r', encoding='utf-8') as file:
    #     data = json.load(file)
    # return data
    collectionRec = db.Recipe
    return [json.loads(json_util.dumps(recipe)) for recipe in collectionRec.find()]

def get_weight_with_unit(quantity, unit):
    unit_mapping = {
    "gallons": 3.785,
    "gallon": 3.785,
    # nguyên liệu này là nước
    "strips": 35,
    "wedges": 38,
    "wedge": 38,
    "quarts": 50,
    "quart": 50,
    "dash": 0.71,
    "dashes": 0.71,
    "pod": 6.1,
    "pods": 6.1,
    "bunch": 340,
    # nguyên liệu này hay bị lộn giữa ngò với cá
    "bunches": 34,
    # nguyên liệu này là rau chân vịt
    "(32 ounce)": 80,
    # nước dùng gà
    "(32": 80,
    # nước dùng gà
    "(28 ounce)": 60,
    # cà chua, salad
    "(18.25 ounce)":50,
    # măng tây đóng hộp
    "(17.5 ounce)": 50,
    # bánh phồng
    "(17.25 ounce)": 50,
    # bánh phồng
    "(16 ounce)": 50,
    # đậu hũ
    "(15.25 ounce)": 40,
    # nước ép xoài
    "(15 ounce)": 60,
    # một vài loại đậu
    "(14.5 ounce)":40,
    # nước dùng
    "(14.25 ounce)": 80,
    # cá chích
    "(14 ounce) can": 40,
    # nước cốt dừa
    "(14 ounce)": 100,
    "(14 ounce) cans": 200,
    # gà
    "(13.5 ounce) cans": 40,
    # sữa dừa
    "(13.5 ounce)": 40,
    # sữa dừa
    "(13 ounce)":40,
    # sữa dừa
    "(12.5": 40,
    # nước ép xoài
    "(12 ounce)": 40,
    # đậu hũ
    "(12": 40,
    # nước ép táo
    "(10.5 ounce)": 50,
    # sữa bò
    "(10 ounce)": 60,
    "(8 ounce)": 80,
    "(8 ounce) package": 50,
    # salad
    "(7 ounce)": 50,
    "(7.75 ounce)": 40,
    # nước sốt cà ri
    "(6.75 ounce)": 50,
    "(6 ounce)":50,
    "(5.5 ounce)":40,
    # nước ép cà chua
    "(5 ounce)": 140,
    # cá ngừ
    "(4 ounce)":112,
    "(3.5 ounce)":60,
    "(3 ounce)":84,
    "(1 ounce)":28,
    # gói rong biển
    "ounce":28,
    "(1 ounce) package": 28,
    "ounces":28,
    "(.25 ounce)": 7,
    "(12 inch)":100,
    # bánh mì
    "(9-inch)":70,
    # bánh
    "(6 inch)":52.4,
    # bánh
    "(4 inch)": 50.6,
    "(4 inch) piece": 20.6,
    # gừng
    "(3 inch)": 20.2,
    # quế
    "(2 inch) piece":20.8,
    "(2 inch)":30.8,
    "(2-inch)":20.8,
    # quế
    "(1 1/2 inch) piece":20.1,
    # gừng
    "(1 1/2-inch) pieces":18.1,
    # quế
    "(1-inch) pieces": 15.4,
    # quế
    "(1 inch) piece":15.4,
    # gừng
    "inch piece":15.4,
    # nghệ
    "pieces":15.4,
    "(1-inch)":15.4,
    "(1 inch)":15.4,
    # gừng
    "inch":15.4,
    # gừng
    "(3/4": 9.05,
    "(1/2-inch)":7.7,
    "(1/2 inch)":7.7,
    "(1/4": 4.35,
    "(1/4-inch-thick)":4.35,
    "teaspoon": 5.69,
    "teaspoons": 5.69,
    "1/2": 2.845,
    "tablespoons": 14.175,
    "tablespoon": 14.175,
    "cup": 100,
    "cups": 100,
    "1/4": 50,
    # nước cốt dừa
    "(4 pound)":716,
    "(3 pound)": 662,
    "(2.5 pound)":635,
    "(2": 635,
    "(2 1/2 pound)":635,
    "(2 pound)":508,
    "(1": 481,
    "pound": 354,
    "pounds": 354,
    "(1 pound)": 354,
    "stalks": 114,
    # dữ liệu chưa ổn do khó khăn trong mapping
    "stalk": 114,
    # dữ liệu chưa ổn do khó khăn trong mapping
    "cloves": 3.6,
    # dữ liệu bị trộn giữa tỏi và thịt
    "clove": 3.6,
    "head": 50,
    # dữ liệu bị trộn giữa rau và cá
    "heads": 30,
    # dữ liệu này là rau cải
    "thin": 5,
    "thick": 25,
    # cái này là lát bánh mì
    "small": 30,
    "medium": 30,
    "large": 50,
    # dữ liệu bị trộn
    "extra-large": 75,
    # kem hành tây
    "pinch": 0.355625,
    "pinches": 0.355625,
    "stick": 20.4,
    # cái này là bơ đậu phộng

    # check lại
    "green": 30,
    # nho hoặc gạo
    "fluid": 30,
    "dried": 50,
    # xúc xích
    "sprig": 1,
    "sprigs": 1,
    "crowns": 50,
    # bông cải xanh
    "onions": 50,
    "onions,": 40,
    # cá tuyết
    "tomato,": 40,
    # cá tuyết
    "drop": 10,
    # bắp
    "drops":1,
    "leaf": 20,
    # cá khô
    "leaves": 10,
    # bug do khó map thông tin
    "cube": 50,
    # thịt
    "cubes": 30,
    # dữ liệu bị trộn
    "loaf": 20,
    # khoai tây
    "slices": 28,
    "slice":28,
    "cucumbers": 40,
    "cucumbers,": 40,
    # cá tuyết
    "bulb": 8,
    # tỏi
    "red":5,
    # tiêu
    "sheet": 5,
    "sheets": 5,
    "serrano": 5,
    # tiêu
    "whole": 10,
    # bánh mì đường
}

    if unit in unit_mapping:
        grams = unit_mapping[unit] * quantity
    elif unit is None or quantity is None:
        grams = 0
    elif unit == "" or quantity == "":
        grams = 0
    else:
        # Xử lý cho các đơn vị không có trong bảng ánh xạ
        print(f"Không tìm thấy ánh xạ cho đơn vị: {unit}")
    
    return grams

# Ánh xạ các ID nguyên liệu sang thông tin về nguyên liệu
def map_ingredient_ids(recipe, ingredient_mapping):
    total_calo = 0
    total_sugar = 0
    total_fat = 0
    total_fiber = 0
    total_protein = 0
    total_carbohydrat = 0
    total_cholesterol = 0
    total_sodium = 0
    total_cost = 0
    total_error = 0
    for ingredient in recipe['ingredients']:
        ingredient_info = ingredient_mapping.get(ingredient['ingredient_id'])
        if ingredient_info:
            # ingredient['info'] = ingredient_info
            ingredient['grams'] = get_weight_with_unit(ingredient['quantity'], ingredient['unit']) / 4
            # chia 4 để giảm độ sai số
            grams_ratio = ingredient['grams'] / 100

            if ingredient['grams'] == 0:
                total_error += 1

            if ingredient_info['nutritions']['energy_kcal'] is not None:
                total_calo += float(ingredient_info['nutritions']['energy_kcal'].replace(',', '.')) * grams_ratio
            if ingredient_info['nutritions']['sugars_g'] is not None:
                total_sugar += float(ingredient_info['nutritions']['sugars_g'].replace(',', '.')) * grams_ratio
            if ingredient_info['nutritions']['fat_g'] is not None:
                total_fat += float(ingredient_info['nutritions']['fat_g'].replace(',', '.')) * grams_ratio
            if ingredient_info['nutritions']['dietary_fiber_g'] is not None:
                total_fiber += float(ingredient_info['nutritions']['dietary_fiber_g'].replace(',', '.')) * grams_ratio
            if ingredient_info['nutritions']['protein_g'] is not None:
                total_protein += float(ingredient_info['nutritions']['protein_g'].replace(',', '.')) * grams_ratio
            if ingredient_info['nutritions']['carbohydrates_g'] is not None:
                total_carbohydrat += float(ingredient_info['nutritions']['carbohydrates_g'].replace(',', '.')) * grams_ratio
            if ingredient_info['nutritions']['cholesterol_mg'] is not None:
                total_cholesterol += float(ingredient_info['nutritions']['cholesterol_mg'].replace(',', '.')) / 1000 * grams_ratio
            if ingredient_info['nutritions']['sodium_mg'] is not None:
                total_sodium += float(ingredient_info['nutritions']['sodium_mg'].replace(',', '.')) / 1000 * grams_ratio

            min_price = None
            for item in ingredient_info['unit_price']:
                price = item['price']
                if price is not None:
                    if type(price) != int:
                        price = price.replace(',', '')  # Loại bỏ dấu phẩy nếu có
                        price = int(price)  # Chuyển đổi giá thành số nguyên
                    if min_price is None or price < min_price:
                        min_price = price
            if min_price is not None:
                total_cost += min_price * grams_ratio
        else:
            total_error += 1

    if recipe['nutrition'] == "":
        recipe['total_calo'] = total_calo
        recipe['total_sugar'] = total_sugar
        recipe['total_fat'] = total_fat
        recipe['total_fiber'] = total_fiber
        recipe['total_protein'] = total_protein
        recipe['total_carbohydrat'] = total_carbohydrat
        recipe['total_cholesterol'] = total_cholesterol
        recipe['total_sodium'] = total_sodium
    else:
        # print(recipe['nutrition'])
        recipe['total_calo'] = float(recipe['nutrition']['calories'].split(' ')[0])
        recipe['total_fat'] = float(recipe['nutrition']['fatContent'].split(' ')[0])
        recipe['total_fiber'] = float(recipe['nutrition']['fiberContent'].split(' ')[0])
        recipe['total_protein'] = float(recipe['nutrition']['proteinContent'].split(' ')[0])
        recipe['total_carbohydrat'] = float(recipe['nutrition']['carbohydrateContent'].split(' ')[0])
        recipe['total_sodium'] = float(recipe['nutrition']['sodiumContent'].split(' ')[0]) / 1000
        total_error = 2

        try:
            recipe['total_sugar'] = float(recipe['nutrition']['sugarContent'].split(' ')[0])
            total_error -= 1
        except KeyError:
            recipe['total_sugar'] = total_sugar
        
        try:
            recipe['total_cholesterol'] = float(recipe['nutrition']['cholesterolContent'].split(' ')[0]) / 1000
            total_error -= 1
        except KeyError:
            recipe['total_cholesterol'] = total_cholesterol

    recipe['total_cost'] = total_cost
    recipe['total_error'] = total_error

# Lưu lại dữ liệu recipe đã được cập nhật
def save_updated_recipe_data(updated_data, file_path):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(updated_data, file, indent=4, ensure_ascii=False)

def process_data():
    ingredient_file_path = '../Data/EatWell.Ingredient.json'
    recipe_file_path = '../Data/EatWell.Recipe.json'

    ingredient = get_ingredient_data()
    recipes = get_recipe_data()

    for recipe in recipes:
        map_ingredient_ids(recipe, ingredient)

    return recipes
    # save_updated_recipe_data(recipes, '../Data/updated_recipe_data.json')

# process_data()