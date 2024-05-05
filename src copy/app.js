import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morganBody from "morgan-body";
import bodyParser from "body-parser";
import anonymousEndpoint from "#src/middlewares/anonymousEndpoint.mdw";
import { handleError } from "#src/middlewares/errorHandler.mdw";
import routes from "#src/routes/index.routes";
import config from "#src/config/config";

//==================== Library =======================
const app = express();

//#region middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
morganBody(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
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

//Start listen app
app.listen(config.PORT, (error) => {
  if (error) {
    console.error();
    console.log("Cannot start backend services.");
  } else {
    console.log("Begin listen on port %s...", config.PORT);
  }
});
