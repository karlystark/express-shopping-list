const express = require("express");
const app = require("./app");
const db = require("./fakeDb");
const router = new express.Router();
const { NotFoundError, BadRequestError } = require("./expressError");
const { route } = require("./app");

router.get("/", function (req, res) {
  return res.json(db);
});

router.post("/", function (req, res) {
  if (!req.body["name"] || !req.body["price"])
    throw new BadRequestError("item name and price required");

  const newItem = req.body;

  db.items.push(newItem);

  return res.json({ added: newItem });
});

module.exports = router;

router.get("/:name", function (req, res) {
  let itemName = req.params.name;
  for (let i = 0; i < db.items.length; i++) {
    if (db.items[i].name === itemName) {
      return res.json(db.items[i]);
    }
  }
  throw new NotFoundError("Items are not found");
});

router.patch("/:name", function (req, res) {
  //if (req.body === undefined) throw new BadRequestError("invalid item");

  let itemName = req.params.name;
  for (let i = 0; i < db.items.length; i++) {
    if (db.items[i].name === itemName) {
      db.items[i].name = req.body.name;
      db.items[i].price = req.body.price;
      return res.json({ updated: db.items[i] });
    }

  }
  throw new NotFoundError("item was not found");
});

router.delete("/:name", function (req, res) {
  //if (req.body === undefined) throw new BadRequestError("invalid item");

  let itemName = req.params.name;

  for (let i = 0; i < db.items.length; i++) {

    if (db.items[i].name === itemName) {

      db.items.splice(i, 1);
      return res.json({ message: "Deleted" });
    }

  }
  throw new NotFoundError("item was not found");
});
