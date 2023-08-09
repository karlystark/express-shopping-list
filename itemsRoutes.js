const express = require("express");
const app = require("./app");
const db = require("./fakeDb");
const router = new express.Router();
const { NotFoundError, BadRequestError} = require("./expressError");

router.get("/", function(req, res) {
  return res.json(items);
})

router.post("/", function(req, res){
  if(req.body === undefined) throw new BadRequestError("not valid items");

  const newItem = req.body;

  db.items.push(newItem);

  return res.json({ added: newItem });
})

module.exports = router;


