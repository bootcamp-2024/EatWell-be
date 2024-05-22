import mongoose from "mongoose";

const ImageDetectSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  { collection: "Image", versionKey: false }
);

const ImageDetect = mongoose.model("Image", ImageDetectSchema);

export default ImageDetect;
