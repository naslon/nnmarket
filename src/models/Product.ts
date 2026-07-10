import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: false },
    images: { type: [String], required: true },
    links: {
      shopee: { type: String, default: "" },
      mercadoLivre: { type: String, default: "" },
      olx: { type: String, default: "" },
      facebook: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
