from generate_meal import DailyMealPlan
from get_data import process_data
from fastapi import FastAPI
import copy 

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/calculate_meals_for_days")
def calculate_meals_for_days(days: int=7, low_salt: bool=False, low_cholesterol: bool=False, fibre_limit: int=None, kcal_limit: int=None, carb_kcal_limit: int=None, protein_kcal_limit: int=None, fat_kcal_limit: int=None, cost_limit: int=300000, meal_count_str: str="1,0,2,2,0", banned_recipes: list=None):
    nutrients_limit = {
        'fibre_limit': fibre_limit,
        'kcal_limit': kcal_limit,
        'carb_kcal_limit': carb_kcal_limit,
        'protein_kcal_limit': protein_kcal_limit,
        'fat_kcal_limit': fat_kcal_limit
    }
    nutrients_limit = {k: v for k, v in nutrients_limit.items() if v is not None}
    meal_count = [int(v) for v in meal_count_str.split(',')]

    data = process_data()

    used_meals = []

    reponse = []
    for day_count in range(days):
        day_name = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][day_count % 7]
        day_name = str(day_count) + ''
        meal_plan_day = DailyMealPlan(
            copy.deepcopy(data),
            limits={'low_salt': low_salt, 'low_cholesterol': low_cholesterol, 'nutrients_limit': nutrients_limit, 'cost_limit': cost_limit, 'meal_count_limit': meal_count},
            day=day_name,
            banned_recipes=banned_recipes,
            used_meals=used_meals)

        try:
            meal_plan = meal_plan_day.get_optimal_meal_plan()
        except TypeError:
            meal_plan_day.recovery_meals(copy.deepcopy(data))
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
        
        reponse.append({f'day_{day_name}': {'meal_plan': meal_plan, 'total_nutritions': total_nutritions}})

    return reponse

# TODO: code phần updata meal
# def update_meal_plan():
#     if not request.form.get('days'):
#         return redirect(url_for('meal_plan'))
#     days = request.form.get('days')
#     days = int(days)
#     allergy = 'lactose' if request.form.get('allergy') else ''
#     low_salt = True if request.form.get('low_salt') else False
#     min_sugar = True if request.form.get('min_sugar') else False
#     new_meal_plan = True if request.form.get('new_meal_plan') else False
#     if new_meal_plan and LOCAL:
#         calculate(days, allergy, low_salt)
#     elif new_meal_plan and not LOCAL:
#         meal_plans, nutrients = get_nutrients_and_meal_plans(
#             days, allergy=allergy, low_salt=low_salt, min_sugar=min_sugar, new_meal_plan=False)
#         return render_template('meal_plan.html', meal_plans=meal_plans, nutrients=nutrients, days=days, server=True)

#     meal_plans, nutrients = get_nutrients_and_meal_plans(
#         days, allergy=allergy, low_salt=low_salt, min_sugar=min_sugar, new_meal_plan=new_meal_plan)
#     return render_template('meal_plan.html', meal_plans=meal_plans, nutrients=nutrients, days=days)

# # days = 30
# # low_salt = True
# # low_cholesterol = False
# kcal_limit = 2100
# # cost_limit = 300000
# # meal_count = "1, 0, 2, 2, 0"
# calculate_meals_for_days(kcal_limit = kcal_limit)