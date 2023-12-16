const express = require("express");

let app = express();

app.use(express.json());
app.use("/", express.static("public"));

let database = [
	{
		"id": 100,
		"name": "Aku Ankka 50/2023",
		"author": "Walt Disney",
		"year": 2023,
		"genre": "cartoon",
		"loaned": false
	},
	{
		"id": 101,
		"name": "Aku Ankka 51/2023",
		"author": "Walt Disney",
		"year": 2023,
		"genre": "cartoon",
		"loaned": true
	},
	{
		"id": 102,
		"name": "Aku Ankka 52/2023",
		"author": "Walt Disney",
		"year": 2023,
		"genre": "cartoon",
		"loaned": false
	}
];
let id = 100;

/* book Object
	id:number, //(autogenerated)
	name:string,
	author:string,
	year:number,
	genre:string,
	loaned:boolean
*/

// REST API

/*
CREATE 	- POST "/api/book"
READ 	- GET "/api/loan"
READ 	- GET "/api/book"
UPDATE 	- PUT "/api/book/:id"
*/

app.post("/api/book", function(req, res) {
	let book = {
		id:id,
		name:req.body.name,
		author:req.body.author,
		year:req.body.year,
		genre:req.body.genre,
		loaned:req.body.loaned
	}
	id++;
	database.push(book);
	return res.status(201).json(book);
})

app.get("/api/loan", function(req, res) {
	let loaned = true;
	let loans = [];
	for (let id = 0; id < database.length; id++) {
		if (database[id].loaned === loaned) {
			loans.push(database[id]);
		}
	}
	return res.status(200).json(loans);
})

app.get("/api/book", function(req, res) {
	return res.status(200).json(database);
})

app.put("/api/loan/:id", function(req, res) {
	let tempId = parseInt(req.params.id);
	for (let i = 0; i < database.length; i++) {
		if (tempId === database[i].id) {
			if (database[i].loaned === false) {
				database[i].loaned = true;
			} else {
				database[i].loaned = false;
			}
			return res.status(200).json({"Message": "Success"})
		}
	}
	return res.status(200).json({"Message": "Not Found"});
})

app.listen(3000);

console.log("Running in port 3000");