const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ObjectID = require("mongodb").ObjectID;
const AppError = require("./AppError");

const Product = require("./models/product");
const Farm = require("./models/farm");

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

//Farm Routes
app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});

app.post(
  "/farms",
  wrapAsync(async (req, res, next) => {
    const newFarm = new Farm(req.body);
    await newFarm.save();
    console.log(newFarm);
    res.redirect(`/farms`);
    //res.redirect(`/farms/${newFarm._id}`);
  })
);

app.get(
  "/farms",
  wrapAsync(async (req, res, next) => {
    const farms = await Farm.find({});
    res.render("farms/index", { farms });
  })
);

app.get(
  "/farms/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      throw new AppError("INVALID ID", 400);
    }
    const farm = await Farm.findById(id).populate("products");
    if (!farm) {
      throw new AppError(`FARM NOT FOUND`, 404);
    }
    res.render("farms/details", { farm });
  })
);

app.get(
  "/farms/:id/products/new",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render("products/new", { categories, farm });
  })
);

app.post(
  "/farms/:id/products",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const newProduct = new Product(req.body);
    farm.products.push(newProduct);
    newProduct.farm = farm;
    await farm.save();
    await newProduct.save();
    res.redirect(`/farms/${farm._id}`);
  })
);

//Product Routes
const categories = ["fruit", "vegetable", "dairy", "fungi"];

function wrapAsync(func) {
  return function (req, res, next) {
    func(req, res, next).catch((err) => next(err));
  };
}

app.get(
  "/products",
  wrapAsync(async (req, res, next) => {
    const products = await Product.find({});
    res.render("products/index", { products });
  })
);

app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});

app.post(
  "/products",
  wrapAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`);
  })
);

app.get(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      throw new AppError("INVALID ID", 400);
    }
    const product = await Product.findById(id).populate("farm", "name");
    if (!product) {
      throw new AppError(`PRODUCT NOT FOUND`, 404);
    }
    res.render("products/details", { product });
  })
);

app.get(
  "/products/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      throw new AppError("INVALID ID", 400);
    }
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError(`PRODUCT NOT FOUND`, 404);
    }
    res.render("products/edit", { product, categories });
  })
);

app.put(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/products/${product._id}`);
  })
);

app.delete(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect(`/products`);
  })
);

const handleValidationError = (err) => {
  console.dir(err);
  return new AppError(`Validation Failed... ${err.message}`, 400);
};

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === "ValidationError") err = handleValidationError(err);
  next(err);
});

app.use((err, req, res, next) => {
  const { message = "OOPS ERROR", status = 500 } = err;
  res.status(status).send(message);
});

app.listen(7001, () => {
  console.log("APP LISTENING ON PORT 7001");
});
