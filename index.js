const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ObjectID = require("mongodb").ObjectID;
const AppError = require("./AppError");

const Product = require("./models/product");

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("DAMMIT THERE WAS A MONGO CONNECTION ERROR!!!");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = ["fruit", "vegetable", "dairy", "fungi"];

app.get("/products", async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.render("products/index", { products });
  } catch (err) {
    next(err);
  }
});

app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});

app.post("/products", async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`);
  } catch (err) {
    next(err);
  }
});

app.get("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      throw new AppError("INVALID ID", 400);
    }
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError(`PRODUCT NOT FOUND`, 404);
    }
    res.render("products/details", { product });
  } catch (err) {
    next(err);
  }
});

app.get("/products/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      throw new AppError("INVALID ID", 400);
    }
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError(`PRODUCT NOT FOUND`, 404);
    }
    res.render("products/edit", { product, categories });
  } catch (err) {
    next(err);
  }
});

app.put("/products/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/products/${product._id}`);
  } catch (err) {
    next(err);
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  res.redirect(`/products`);
});

app.use((err, req, res, next) => {
  const { message = "OOPS ERROR", status = 500 } = err;
  res.status(status).send(message);
});

app.listen(7001, () => {
  console.log("APP LISTENING ON PORT 7001");
});
