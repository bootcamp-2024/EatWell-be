import json
import numpy as np
from scipy.optimize import linprog
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
import copy 

# TODO: chú thích cho code
class DailyMealPlan:
    def __init__(self, meals_data, limits={}, used_meals=None, banned_recipes=None, day='monday'):
        self.daily_meal_plan_calculated = False
        self.day = day
        self.limits = limits

        self.meals_data = meals_data
        
        if used_meals is not None:
            self.remove_used_meals(used_meals)
        if banned_recipes is not None:
            self.remove_banned_recipes(banned_recipes)

        def get_limit(limit_name, default, limits_list):
            try:
                return limits_list[limit_name]
            except KeyError:
                return default
        
        # Mandatory limits
        self.fibre_limit = get_limit('fibre_limit', 25, self.limits['nutrients_limit'])
        self.kcal_limit = get_limit('kcal_limit', 2000, self.limits['nutrients_limit'])
        self.carb_kcal_limit = get_limit('carb_kcal_limit', self.kcal_limit * 0.5, self.limits['nutrients_limit'])
        self.protein_kcal_limit = get_limit('protein_kcal_limit', self.kcal_limit * 0.3, self.limits['nutrients_limit'])
        self.fat_kcal_limit = get_limit('fat_kcal_limit', self.kcal_limit * 0.2, self.limits['nutrients_limit'])
        self.cost_limit = get_limit('cost_limit', 300000, self.limits)
        self.meal_count_limit = get_limit('meal_count_limit', [1, 0, 2, 2, 0], self.limits)
        self.count_limit = sum(self.meal_count_limit)

        # Extra
        if self.limits['low_salt']:
            self.salt_limit = 2     
        if self.limits['low_cholesterol']:
            self.cholesterol_limit = 1

    def recovery_meals(self, recovery_meal):
        self.meals_data = recovery_meal

    def remove_used_meals(self, used_meals):
        remove_n = int(round(len(used_meals) * 0.8))
        # used_meals = np.random.choice(used_meals, remove_n, replace=False)
        removed_meals = np.random.choice(used_meals, remove_n, replace=False)
        # print(len(removed_meals))
        self.meals_data = [meal for meal in self.meals_data if meal['_id']['$oid'] not in [_['_id']['$oid'] for _ in removed_meals]]
        # print(len(self.meals_data))

    def remove_banned_recipes(self, banned_recipes):
        self.meals_data = [meal for meal in self.meals_data if meal['_id']['$oid'] not in [_['_id']['$oid'] for _ in banned_recipes]]

    def calculate_optimal_meal_plan(self):
        # Prepare data for optimization
        num_meals = len(self.meals_data)
        sugar = np.array([meal['total_sugar'] for meal in self.meals_data])
        fibre = np.array([meal['total_fiber'] for meal in self.meals_data])
        kcal = np.array([meal['total_calo'] for meal in self.meals_data])
        carb_kcal = np.array([meal['total_carbohydrat'] for meal in self.meals_data])
        protein_kcal = np.array([meal['total_protein'] for meal in self.meals_data])
        fat_kcal = np.array([meal['total_fat'] for meal in self.meals_data])
        sodium = np.array([meal['total_sodium'] for meal in self.meals_data])
        cholesterol = np.array([meal['total_cholesterol'] for meal in self.meals_data])
        error = np.array([meal['total_error'] for meal in self.meals_data])
        cost = np.array([meal['total_cost'] for meal in self.meals_data])
        count = np.ones(num_meals)

        # Set upper bounds and equality constraints
        if self.limits['low_salt']:
            if self.limits['low_cholesterol']:
                A_upperbounds = np.array([-error, -fibre, carb_kcal, protein_kcal, fat_kcal, cost, sodium, cholesterol])
                b_upperbounds = np.array([0, -self.fibre_limit, self.carb_kcal_limit, self.protein_kcal_limit, self.fat_kcal_limit, self.cost_limit, self.salt_limit, self.cholesterol_limit])
                # A_upperbounds b_upperbounds là dành cho bất đẳng thức
            else:
                A_upperbounds = np.array([-error, -fibre, carb_kcal, protein_kcal, fat_kcal, cost, sodium])
                b_upperbounds = np.array([0, -self.fibre_limit, self.carb_kcal_limit, self.protein_kcal_limit, self.fat_kcal_limit, self.cost_limit, self.salt_limit])
                # A_upperbounds b_upperbounds là dành cho bất đẳng thức
        elif self.limits['low_cholesterol']:
            A_upperbounds = np.array([-error, -fibre, carb_kcal, protein_kcal, fat_kcal, cost, cholesterol])
            b_upperbounds = np.array([0, -self.fibre_limit, self.carb_kcal_limit, self.protein_kcal_limit, self.fat_kcal_limit, self.cost_limit, self.cholesterol_limit])
            # A_upperbounds b_upperbounds là dành cho bất đẳng thức
        else:
            A_upperbounds = np.array([-error, -fibre, carb_kcal, protein_kcal, fat_kcal, cost])
            b_upperbounds = np.array([0, -self.fibre_limit, self.carb_kcal_limit, self.protein_kcal_limit, self.fat_kcal_limit, self.cost_limit])

        # A_equality = np.array([kcal, carb_kcal, protein_kcal, fat_kcal])
        # b_equality = np.array([self.kcal_limit, self.carb_kcal_limit, self.protein_kcal_limit, self.fat_kcal_limit])
        A_equality = np.array([count, kcal])
        b_equality = np.array([self.count_limit, self.kcal_limit])
        # A_equality b_equality là dành cho đẳng thức chính xác

        # Set optimization bounds
        bounds = [(0, 3) for _ in range(num_meals)]
        # hàm lượng của món ăn

        # Solve optimization problem
        solution = linprog(
            c=sugar,
            # c là giá trị cần tối thiểu hóa
            A_ub=A_upperbounds,
            b_ub=b_upperbounds,
            A_eq=A_equality,
            b_eq=b_equality,
            bounds=bounds
        )

        # Update meals_data with optimized grams
        self.meals_plan = []
        for i, meal in enumerate(self.meals_data):
            meal['grams'] = solution.x[i] * 100

        self.meals_plan = [meal for meal in self.meals_data if meal['grams'] > 0]

        self.daily_meal_plan_calculated = True

    def get_optimal_meal_plan(self):
        if not self.daily_meal_plan_calculated:
            self.calculate_optimal_meal_plan()
        
        while(True):
            if len(self.meals_plan) + 1 < sum(self.meal_count_limit):
                self.count_limit *= 1.5
                self.calculate_optimal_meal_plan()
            else:
                break
        
        meals_plan = copy.deepcopy(self.meals_plan)

        # Calculating meal plans nutrient quantities for each food
        nutrients = ['total_fiber', 'total_sugar', 'total_calo', 'total_carbohydrat',
                    'total_protein', 'total_fat', 'total_cost']
        
        # Rounding to nearest 10g and each nutrient is per 100g
        for meal in meals_plan:
            meal['grams'] = round(meal['grams'] / 10) * 10
            gram_ratio = meal['grams'] / 100
            # làm tròn đơn vị hàng chục
            for nutrient in nutrients:
                meal[nutrient] = round(meal[nutrient] * gram_ratio, 2)
            meal['total_sodium']  *= gram_ratio
            meal['total_cholesterol']  *= gram_ratio

        meals_plan.sort(key=lambda x: x['total_calo'], reverse=True)
        # sắp xếp dữ liệu giảm dần theo total_calo

        meals_plan = [meal for meal in meals_plan if meal['grams'] >= 10]  
        # taking only recommendations over 10 grams
        self.meals_plan = meals_plan
        
        return meals_plan

    def get_total_nutrients(self):
        optimal_meal_plan = self.meals_plan

        nutrients_sum = {nutrient: 0 for nutrient in ['total_fiber', 'total_sugar', 'total_calo', 'total_carbohydrat',
                    'total_protein', 'total_fat', 'total_sodium', 'total_cholesterol', 'total_cost']}

        for meal in optimal_meal_plan:
            for nutrient in nutrients_sum:
                value = meal[nutrient]
                nutrients_sum[nutrient] += value

        nutrients_sum['total_count'] = len(optimal_meal_plan)

        self.total_nutrients = nutrients_sum
        
        return nutrients_sum
    
    def arrange_meal(self):
        def sort_arrays(arrays, name_meals):
            # Sắp xếp các mảng theo giá trị của phần tử và điểm first_value của name_meal
            sorted_arrays = sorted(arrays, key=lambda x: (-list(x.values())[0], name_meals.index(list(x.keys())[0])))
            sorted_arrays_new = []
            for arr in sorted_arrays:
                sorted_arrays_new.append(arr)

            return sorted_arrays_new

        # Hàm để tạo mảng với giá trị của mỗi phần tử là giá trị của phần tử trước đó chia 2
        def create_array(length, first_value, name_meal):
            if length == 0:
                return []
            
            array = [{name_meal: first_value}]
            for i in range(1, length):
                array.append({name_meal: array[-1][name_meal] / 2})
            
            return array

        def process_array(length_array, meal_count):
            first_values = [4, 2, 7, 6, 2]
            name_meals = ['Breakfast', 'Elevenses', 'Lunch', 'Dinner', 'Snack']
            sum_length = sum(length_array)
            arrays = []

            if sum_length < meal_count:
                for _ in range(meal_count - sum_length):
                    probs = [f / 2**v for f, v in zip(first_values, length_array)]
                    idx = probs.index(max(probs))
                    length_array[idx] += 1

            # Vòng lặp qua độ dài mỗi mảng và giá trị của phần tử đầu tiên
            for length, first_value, name in zip(length_array, first_values, name_meals):
                new_array = create_array(length, first_value, name)
                arrays = arrays + new_array

            # Sắp xếp các mảng
            sorted_arrays = sort_arrays(arrays, name_meals)

            if sum_length > meal_count:
                sorted_arrays = sorted_arrays[:meal_count]

            return sorted_arrays
        
        optimal_meal_plan = copy.deepcopy(self.meals_plan)
        w_array = process_array(self.meal_count_limit, len(optimal_meal_plan))

        for meal, meal_time in zip(optimal_meal_plan, w_array):
            meal['meal_time'] = list(meal_time.keys())[0]

        return optimal_meal_plan

    def save_meal_plan_to_json(self):
        optimal_meal_plan = self.meals_plan

        json_path = f'../Data/daily_meal_plans/new/{self.day}_meal_plan.json'

        with open(json_path, 'w', encoding='utf-8') as file:
            json.dump(optimal_meal_plan, file, indent = 4, ensure_ascii = False) 

    def save_total_nutrients_to_json(self):
        total_nutrients = self.total_nutrients

        json_path = f'../Data/daily_meal_plans/new/{self.day}_nutrients.json'

        with open(json_path, 'w', encoding='utf-8') as file:
            json.dump(total_nutrients, file, indent = 4, ensure_ascii = False) 

def find_other_recipe(recipe, recipe_data):
    # Giá trị mục tiêu của bạn
    gram_ratio = recipe['grams'] / 100
    target = np.array([recipe['total_calo'] / gram_ratio, recipe['total_fat'] / gram_ratio, recipe['total_fiber'] / gram_ratio, recipe['total_protein'] / gram_ratio, recipe['total_carbohydrat'] / gram_ratio, recipe['total_sugar'] / gram_ratio, recipe['total_cost'] / gram_ratio, recipe['total_sodium'] / gram_ratio, recipe['total_cholesterol'] / gram_ratio, recipe['total_error']]).reshape(1, -1)

    # ID của công thức bạn muốn loại trừ
    excluded_id = recipe['_id']['$oid']

    # Loại bỏ công thức với ID mong muốn
    filtered_data = [[rec['total_calo'], rec['total_fat'], rec['total_fiber'], rec['total_protein'], rec['total_carbohydrat'], rec['total_sugar'], rec['total_cost'], rec['total_sodium'], rec['total_cholesterol'], rec['total_error']] for rec in recipe_data if rec['_id']['$oid'] != excluded_id]
    filtered_recipe_ids = [rec['_id']['$oid'] for rec in recipe_data if rec['_id']['$oid'] != excluded_id]

    # # Chuẩn hóa dữ liệu
    scaler = StandardScaler()
    data_normalized = scaler.fit_transform(filtered_data)
    target_normalized = scaler.transform(target)

    # Sử dụng kNN để tìm công thức gần nhất
    knn = NearestNeighbors(n_neighbors=1, metric='euclidean')
    knn.fit(data_normalized)
    distances, indices = knn.kneighbors(target_normalized)

    # Lấy công thức gần nhất
    closest_recipe_index = indices[0][0]
    closest_recipe_id = filtered_recipe_ids[closest_recipe_index]
    closest_recipe = next(rec for rec in recipe_data if rec['_id']['$oid'] == closest_recipe_id)
    
    # Rounding to nearest 10g and each nutrient is per 100g
    closest_recipe['grams'] = recipe['grams']
    closest_recipe['meal_time'] = recipe['meal_time']

    # làm tròn đơn vị hàng chục
    nutrients = ['total_calo', 'total_fat', 'total_fiber', 'total_protein',
                'total_carbohydrat', 'total_sugar', 'total_cost', 'total_sodium','total_cholesterol']
    for nutrient in nutrients:
        closest_recipe[nutrient] = round(closest_recipe[nutrient] * gram_ratio, 2)
    closest_recipe['total_sodium']  *= gram_ratio
    closest_recipe['total_cholesterol']  *= gram_ratio

    return closest_recipe

def get_total_nutrients(meal_plan):
    nutrients_sum = {nutrient: 0 for nutrient in ['total_fiber', 'total_sugar', 'total_calo', 'total_carbohydrat',
                'total_protein', 'total_fat', 'total_sodium', 'total_cholesterol', 'total_cost']}

    for meal in meal_plan:
        for nutrient in nutrients_sum:
            value = meal[nutrient]
            nutrients_sum[nutrient] += value
    
    nutrients_sum['total_count'] = len(meal_plan)

    return nutrients_sum