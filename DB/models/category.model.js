import mongoose from "mongoose";
const { Schema, model } = mongoose;
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // ToDo
    },
    Images: 
      {
        secure_url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    
    customId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Category = mongoose.models.Category || model("Category", categorySchema);
