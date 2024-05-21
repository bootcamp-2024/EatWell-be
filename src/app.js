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

// // Kết nối MongoDB
// mongoose.connect(config.DATABASE.URI);
// const db = mongoose.connection;

// const Meal_Plan = db.collection("Meal_Plan");

// async function checkAndSendBreakfastNotification() {
//   const today = moment().startOf("day").format("DD-MM-YY");
//   // const tomorrow = moment(today).add(1, 'day');

//   const data = await db
//     .collection("Meal_Plan")
//     .find({
//       meal_day: today,
//     })
//     .toArray();

//   try {
//     const breakfast = await Meal_Plan.findOne({
//       meal_day: today,
//     });

//     if (breakfast) {
//       // Gửi email thông báo
//       const mailOption = getAlertEmail("thanhthaothaothao2@gmail.com");
//       await createTransport().sendMail(mailOption);
//     }
//   } catch (error) {
//     console.error("Lỗi khi kiểm tra bữa sáng:", error);
//   }
// }

// // Lập lịch cho việc kiểm tra và gửi email thông báo lúc 7 giờ sáng mỗi ngày
// schedule.scheduleJob({ hour: 2, minute: 0 }, function () {
//   checkAndSendBreakfastNotification();
// });

//Start listen app
app.listen(config.PORT, (error) => {
  if (error) {
    console.error();
    console.log("Cannot start backend services.");
  } else {
    console.log("Begin listen on port %s...", config.PORT);
  }
});
