/** @format */

const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = 5000;
//middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tpqimfj.mongodb.net/?retryWrites=true&w=majority`;
//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yalniug.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		await client.connect();
		console.log("connected to MongoDB!");
		const database = client.db("mobileapp");
		const productCollection = database.collection("products");
		const orderCollection = database.collection("orders");

		//Get Product API
		app.get("/products", async (req, res) => {
			console.log(req.query);
			const cursor = productCollection.find({});
			const page = req.query.page;
			const size = parseInt(req.query.size);
			let products;
			if (page) {
				products = await cursor
					.skip(page * size)
					.limit(size)
					.toArray();
			} else {
				products = await cursor.toArray();
			}
			res.send({ products });

			//const count = await productCollection.countDocuments({});
		});
		//usePost to React data ket
		app.post("/products/bykeys", async (req, res) => {
			const keys = req.body;
			const query = { key: { $in: keys } };
			const products = await productCollection.find(query).toArray();
			res.json(products);
		});
		//aadd order api
		app.post("/orders", async (req, res) => {
			const order = req.body;
			const result = await orderCollection.insertOne(order);

			res.json(result);
		});
		//
	} finally {
		//await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("running ginius server");
});

app.listen(port, () => {
	console.log(port);
});
//   DB_USER=emajohn
// DB_PASS=VEsChD7145e4ZrUz
// git init
// git add .
// git commit -m 'emajohn-swrver'
// git push
