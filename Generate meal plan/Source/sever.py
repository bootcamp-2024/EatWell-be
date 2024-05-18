from generate_meal import DailyMealPlan, find_other_recipe, get_total_nutrients
from get_data import process_data
from fastapi import FastAPI, HTTPException
from bson import ObjectId
from pymongo import MongoClient
from datetime import date, timedelta
import copy 

uri = "mongodb+srv://ithao252:rHgYZhyO8fRrVQKx@eatwell.ywx6khc.mongodb.net/"
client = MongoClient(uri)
db = client['EatWell']
collectionMeal = db.Meal_Plan
app = FastAPI()
recipe_data = process_data()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/calculate_meals_for_days")
def calculate_meals_for_days(userId: str, days: int=7, low_salt: bool=False, low_cholesterol: bool=False, fibre_limit: int=None, kcal_limit: int=None, carb_kcal_limit: int=None, protein_kcal_limit: int=None, fat_kcal_limit: int=None, cost_limit: int=300000, meal_count_str: str="1,0,2,2,0", banned_recipes: list=None):
    try:
        today = date.today()
        nutrients_limit = {
            'fibre_limit': fibre_limit,
            'kcal_limit': kcal_limit,
            'carb_kcal_limit': carb_kcal_limit,
            'protein_kcal_limit': protein_kcal_limit,
            'fat_kcal_limit': fat_kcal_limit
        }
        nutrients_limit = {k: v for k, v in nutrients_limit.items() if v is not None}
        meal_count = [int(v) for v in meal_count_str.split(',')]

        used_meals = []

        for day_count in range(days):
            day_name = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][day_count % 7]
            day_name = str(day_count) + ''
            meal_plan_day = DailyMealPlan(
                copy.deepcopy(recipe_data),
                limits={'low_salt': low_salt, 'low_cholesterol': low_cholesterol, 'nutrients_limit': nutrients_limit, 'cost_limit': cost_limit, 'meal_count_limit': meal_count},
                day=day_name,
                banned_recipes=banned_recipes,
                used_meals=used_meals)

            try:
                meal_plan = meal_plan_day.get_optimal_meal_plan()
            except TypeError:
                meal_plan_day.recovery_meals(copy.deepcopy(recipe_data))
                meal_plan = meal_plan_day.get_optimal_meal_plan()

            meal_plan = meal_plan_day.arrange_meal()
            total_nutritions = meal_plan_day.get_total_nutrients()

            print(f"-------------------Done for day {day_name}-------------------")
            # for meal in meal_plan:
            #     print(meal['name'])
            #     print(meal['url'])
            #     print(meal['grams'], meal['total_calo'])

            used_meals = used_meals + meal_plan
            meal_plan_day.save_meal_plan_to_json()
            meal_plan_day.save_total_nutrients_to_json()
            
            meal_day = (today + timedelta(days=day_count)).strftime("%d-%m-%y")
            collectionMeal.delete_many({'meal_day': meal_day})
            meal_data = {'userId': ObjectId(userId), 'meal_day': meal_day,'meal_plan': meal_plan, 'total_nutritions': total_nutritions}
            result = collectionMeal.insert_one(meal_data)

        return {"message": "Gen meal successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get('/regenerate_meal_day')
def regenerate_meal_day(userId: str, day: str, recipeId: str):
    try:
        meal = collectionMeal.find_one({'meal_day': day, 'userId': ObjectId(userId)})

        indx = -1
        recipe = None
        for i in range(len(meal['meal_plan'])):
            if meal['meal_plan'][i]['_id']['$oid'] == recipeId:
                indx = i
                recipe = meal['meal_plan'][i]
                break
                
        if indx == -1:
            return {"message": "Gen meal unsuccessfully!!!"}

        new_recipe = find_other_recipe(recipe, recipe_data)
        meal['meal_plan'][indx] = new_recipe
        meal['total_nutritions'] = get_total_nutrients(meal['meal_plan'])
        
        myquery = {'meal_day': day, 'userId': ObjectId(userId)}
        newvalues = { "$set": { "meal_plan": meal['meal_plan'], "total_nutritions": meal['total_nutritions'] } }
        collectionMeal.update_one(myquery, newvalues)

        return {"message": "Gen meal successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# regenerate_meal_day(userId='663cb94b841a8044787c79a3', day="17-05-24", recipeId='663c43204be674bfbd09f826')
# days = 1
# # low_salt = True
# # low_cholesterol = False
# kcal_limit = 2100
# # cost_limit = 300000
# # meal_count = "1, 0, 2, 2, 0"
# calculate_meals_for_days(days=days, kcal_limit = kcal_limit)