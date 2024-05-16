import axios from "axios";
import config from "#src/config/config";

async function getMealPlanFromFastAPI(params) {
  try {
    const response = await axios.get(
      `${config.FAST_API_URL}/calculate_meals_for_days`,
      {
        params,
      }
    );
    if (response.status === 200) {
      const mealPlanData = response.data;
      return mealPlanData;
    } else {
      console.error(
        "Failed to fetch meal plan data. Status code:",
        response.status
      );
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

export { getMealPlanFromFastAPI };
