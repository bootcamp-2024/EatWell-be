// Hàm tính chỉ số BMR
function calculateBMR(gender, weight, height, age) {
    let bmr;
    if (gender === 'male') {
      bmr = 66.47 + 13.75 * weight + 5.003 * height - 6.755 * age;
    } else if (gender === 'female') {
      bmr = 655.1 + 9.563 * weight + 1.85 * height - 4.676 * age;
    }
    return bmr;
  }
  
  // Hàm tính nhu cầu năng lượng hàng ngày
  function calculateTDEE(bmr, activityLevel) {
    const activityLevels = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };
    return bmr * activityLevels[activityLevel];
  }
  
  // Tính toán năng lượng cho 3 bữa ăn
  function calculateMealNutrition(tdee) {
    const breakfastCalories = tdee * 0.25;
    const lunchCalories = tdee * 0.35;
    const dinnerCalories = tdee * 0.3;
  
    // Tính toán chỉ số dinh dưỡng cho từng bữa ăn
    const nutritionPerMeal = {
      breakfast: {
        protein: breakfastCalories * 0.15 / 4,
        fat: breakfastCalories * 0.25 / 9,
        carbohydrat: breakfastCalories * 0.6 / 4,
        fiber: 10, // Giả sử 10g fiber cho bữa sáng
        calories: breakfastCalories,
      },
      lunch: {
        protein: lunchCalories * 0.2 / 4,
        fat: lunchCalories * 0.3 / 9,
        carbohydrat: lunchCalories * 0.5 / 4,
        fiber: 15, // Giả sử 15g fiber cho bữa trưa
        calories: lunchCalories,
      },
      dinner: {
        protein: dinnerCalories * 0.2 / 4,
        fat: dinnerCalories * 0.3 / 9,
        carbohydrat: dinnerCalories * 0.5 / 4,
        fiber: 10, // Giả sử 10g fiber cho bữa tối
        calories: dinnerCalories,
      },
    };
  
    return nutritionPerMeal;
  }
  
  // Sử dụng các hàm trên
  const gender = 'male'; // Thay đổi giới tính nếu cần
  const weight = 70; // Đơn vị: kg
  const height = 175; // Đơn vị: cm
  const age = 30;
  const activityLevel = 'moderate'; // Thay đổi mức độ vận động
  
  const bmr = calculateBMR(gender, weight, height, age);
  const tdee = calculateTDEE(bmr, activityLevel);
  const mealCalories = calculateMealCalories(tdee);
  
  console.log('Breakfast calories:', mealCalories.breakfastCalories);
  console.log('Lunch calories:', mealCalories.lunchCalories);
  console.log('Dinner calories:', mealCalories.dinnerCalories);
  