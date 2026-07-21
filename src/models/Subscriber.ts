import mongoose, { Schema, models, model } from "mongoose";

const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    unsubscribeToken: { type: String, required: true },
    ativo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Subscriber = models.Subscriber || model("Subscriber", SubscriberSchema);

export default Subscriber;
