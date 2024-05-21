import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morganBody from "morgan-body";
import bodyParser from "body-parser";
import anonymousEndpoint from "#src/middlewares/anonymousEndpoint.mdw";
import { handleError } from "#src/middlewares/errorHandler.mdw";
import routes from "#src/routes/index.routes";
import config from "#src/config/config";
import moment from "moment";
// import schedule from "node-schedule";
// import nodemailer from "nodemailer";
// import { createTransport, getAlertEmail } from "#src/utils/mailer";
//==================== Library =======================
const app = express();

//#region middleware
app.use(cors());
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
morganBody(app);
app.use(bodyParser.json({ limit: "20mb", type: "application/json" }));
app.use(
  bodyParser.urlencoded({
    limit: "20mb",
    extended: true,
    parameterLimit: 50000,
    type: "application/x-www-form-urlencoded",
  })
);
app.use(routes);
app.use(anonymousEndpoint);
app.use(handleError);

//#endregion middleware
import { MongoClient } from "mongodb";

const URL =
  "mongodb+srv://ithao252:rHgYZhyO8fRrVQKx@eatwell.ywx6khc.mongodb.net/";
const DB = "test";
const UserPreferenceCollection = "UserPreference";
const MealPlanCollection = "Meal_Plan";

async function main() {
  const client = new MongoClient(URL);

  try {
    await client.connect();

    await processUserPreferences(client);
    await processMealPlans(client);
    // You can add more functions to process other collections here
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

async function processUserPreferences(client) {
  const db = client.db(DB);
  const collection = db.collection(UserPreferenceCollection);
  const usersCursor = await collection.find();
  const users = await usersCursor.toArray();

  if (users.length > 0) {
    const user_info = [];
    users.forEach((user) => {
      user.healthRecords.forEach((update) => {
        const data = {
          user_id: String(user._id),
          date: new Date(update.updatedAt).toISOString().split("T")[0],
          height: update.height,
          weight_diff: calculateWeightDifference(user_info, update),
          bmi_diff: calculateBMIDifference(user_info, update),
          weight: update.weight,
          bmi: update.BMI,
          bmr: update.BMR,
        };
        user_info.push(data);
      });
    });

    if (user_info.length > 0) {
      const analyticsDB = client.db("Analytics");
      const userInfoCollection = analyticsDB.collection("UserInfo");
      await userInfoCollection.deleteMany({});
      await userInfoCollection.insertMany(user_info);

      console.log("Processed user preferences.");
      console.log(user_info);
    } else {
      console.log("No user preferences to process.");
    }
  } else {
    console.log("No users found.");
  }
}

async function processMealPlans(client) {
  const db = client.db(DB);
  const collection = db.collection(MealPlanCollection);
  const mealsCursor = await collection.find();
  const meals = await mealsCursor.toArray();

  if (meals.length > 0) {
    const meal_plan = [];
    meals.forEach((meals) => {
      if ("meal_plan" in meals) {
        meals.meal_plan.forEach((meal) => {
          const data = {
            user_id: String(meals.userId),
            date: meals.meal_day,
            meal_time: meal.meal_time,
            calories: meal.total_calo,
            sugar: meal.total_sugar,
            fat: meal.total_fat,
            fiber: meal.total_fiber,
            protein: meal.total_protein,
            carbohydrat: meal.total_carbohydrat,
            cholesterol: meal.total_cholesterol,
            sodium: meal.total_sodium,
            cost: meal.total_cost,
          };
          meal_plan.push(data);
        });
      }
    });

    if (meal_plan.length > 0) {
      const analyticsDB = client.db("Analytics");
      const mealsCollection = analyticsDB.collection("Meals");
      await mealsCollection.deleteMany({});
      await mealsCollection.insertMany(meal_plan);

      console.log("Processed meal plans.");
      console.log(meal_plan);
    } else {
      console.log("No meal plans to process.");
    }
  } else {
    console.log("No meals found.");
  }
}

function calculateWeightDifference(user_info, update) {
  if (user_info.length === 0) {
    return 0; // No previous weight available, return 0
  }
  const lastWeight = user_info[user_info.length - 1].weight;
  return ((update.weight - lastWeight) / lastWeight) * 100;
}

function calculateBMIDifference(user_info, update) {
  if (user_info.length === 0) {
    return 0; // No previous BMI available, return 0
  }
  const lastBMI = user_info[user_info.length - 1].bmi;
  return ((update.BMI - lastBMI) / lastBMI) * 100;
}

// Call the main function to start the process
main();

//Connect to MongoDB
if (config.DATABASE.URI) {
  mongoose
    .connect(config.DATABASE.URI)
    .then(() => {
      console.log("Mongodb connected");
    })
    .catch((error) => {
      console.error(
        "Please make sure Mongodb is installed and running!",
        error
      );
      process.exit(1);
    });
} else {
  console.error("Database URI is undefined. Please check your configuration!");
  process.exit(1);
}

//Start listen app
app.listen(config.PORT, (error) => {
  if (error) {
    console.error();
    console.log("Cannot start backend services.");
  } else {
    console.log("Begin listen on port %s...", config.PORT);
  }
});
