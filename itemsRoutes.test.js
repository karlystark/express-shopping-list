const request = require("supertest");
const app = require("./app");
let db = require("./fakeDb");

let popsicle;

beforeEach(function () {
  popsicle = { name: "popsicle", price: 3.50 };
  db.items.push(popsicle);
});

afterEach(function () {
  db.items.length = 0;
});


/** GET /items -
 * returns `{ items: {name: "popsicle", price: 3.50}}*/

describe("GET /items", function () {
  it("Gets a list of items", async function () {
    const response = await request(app).get('/items');

    expect(response.body).toEqual({
      "items": [{ name: "popsicle", price: 3.50 }]
    });
    expect(response.statusCode).toEqual(200);
  });
});

/** GET /items/:name -
 * returns `{name: "popsicle", price: 3.50}*/

describe("Get /items/:name", function () {
  it("Gets a single item", async function () {
    const response = await request(app).get(`/items/popsicle`);

    expect(response.body).toEqual({ name: "popsicle", price: 3.50 });
    expect(response.statusCode).toEqual(200);
  });

  it("Returns a 404 if item not found", async function () {
    const response = await request(app).get('/items/blueberry');

    expect(response.statusCode).toEqual(404);
  });
});

/** POST /items/:name -
 * returns `{added: {name: "popsicle", price: 3.50}}*/

describe("Post /items/:name", function () {

  it("Adds an item to fakeDb", async function () {
    const response = await request(app)
      .post('/items')
      .send({
        name: "skittles",
        price: 1.25
      });

    expect(db.items).toContainEqual({ name: "skittles", price: 1.25 });
  });

  it("Returns item added message", async function () {
    const response = await request(app)
    .post('/items')
    .send({
      name: "skittles",
      price: 1.25
    });

    expect(response.body).toEqual({ added: { name: "skittles", price: 1.25 } });
    expect(response.statusCode).toEqual(200);
  });

  it("Returns a 400 if bad request", async function () {
    const badResponse = await request(app)
      .post('/items')
      .send({});

    expect(badResponse.statusCode).toEqual(400);
  });
})


/** PATCH /items/:name -
 * returns {updated: {name: "new popsicle", price: 2.45}}*/

describe("PATCH /items/:name", function(){

it("Updates item in fakeDb", async function(){
const response = await request(app)
.patch('/items/popsicle')
.send({
  name: "new popsicle",
  price: 2.45
});

expect(db.items).toContainEqual({name: "new popsicle", price: 2.45});
});

it("Returns correct response after PATCH", async function(){
  const response = await request(app)
  .patch('/items/popsicle')
  .send({
    name: "new popsicle",
    price: 2.45
  });

  expect(response.body).toEqual({updated: {name: "new popsicle", price: 2.45}});
  expect(response.statusCode).toEqual(200);
});

it("Returns 404 if item not found", async function(){
  const badResponse = await request(app)
  .patch('/items/water')
  .send({

  });

  expect(badResponse.statusCode).toEqual(404);
});
});

/** DELETE /items/:name -
 * returns {message: "Deleted"}*/

describe("DELETE /items/:name", function(){

  it("Returns correct response after DELETE", async function(){
    const response = await request(app).delete('/items/popsicle');

    expect(response.body).toEqual({message: "Deleted"});
    expect(response.statusCode).toEqual(200);
  });

  it("Deletes item from fakeDb", async function(){
    const response = await request(app).delete('/items/popsicle');

    expect(db.items).toEqual([]);
  });

  it("Returns 404 if item not found", async function(){
    const badResponse = await request(app).delete('/items/water');

    expect(badResponse.statusCode).toEqual(404);
  })
})
