const mongoose = require("mongoose");
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

// const p = new Product({
//   image:
//     "https://www.naturehills.com/pub/media/catalog/product/r/u/ruby-red-grapefruit-600x600.jpg",
//   name: "Ruby Grapefruit",
//   price: 1.99,
//   category: "fruit",
// });
// p.save()
//   .then((p) => {
//     console.log(p);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
const seedProducts = [
  {
    image:
      "https://www.naturehills.com/pub/media/catalog/product/r/u/ruby-red-grapefruit-600x600.jpg",
    name: "Ruby Grapefruit",
    price: 1.99,
    category: "fruit",
  },
  {
    image:
      "https://www.johnnyseeds.com/dw/image/v2/BBBW_PRD/on/demandware.static/-/Sites-jss-master/default/dw674a847b/images/products/vegetables/02260_01_fairytale.jpg?sw=387&cx=426&cy=82&cw=1054&ch=1054",
    name: "Fairy Eggplant",
    price: 1.0,
    category: "vegetable",
  },
  {
    image:
      "https://goodeggs1.imgix.net/product_photos/EPGI2ysNQ2eHGWKom4oQ_KKNpxphpRsW05SOizfJ0_TtkyuhdezxX1T7FvAn6qhDZc4wV0JwOPoAHaQRooMwY.jpg?w=840&h=525&fm=jpg&q=80&fit=crop",
    name: "Organic Goddess Melon",
    price: 4.99,
    category: "fruit",
  },
  {
    image:
      "https://cf.ltkcdn.net/organic/images/orig/205485-2121x1414-seedlesswatermelon.jpg",
    name: "Organic Mini Seedless Watermelon",
    price: 3.99,
    category: "fruit",
  },
  {
    image:
      "https://goodeggs2.imgix.net/product_photos/S3fSlEwqRgufF88Yjz7n_celery_04.jpg?w=840&h=525&fm=jpg&q=80&fit=crop",
    name: "Organic Celery",
    price: 1.5,
    category: "vegetable",
  },
  {
    image:
      "https://3uzw94322hve1rpsapqye6h1-wpengine.netdna-ssl.com/wp-content/uploads/Choc_Milk-pour-web.jpg",
    name: "Chocolate Whole Milk",
    price: 2.69,
    category: "dairy",
  },
];
Product.insertMany(seedProducts)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
