const express = require("express");

let app = express();

app.use(express.json());
app.use("/", express.static("public"));

let database = [];
let id = 100;

/* craps Object
	eyecount:number,
	passornot:boolean,
	id:number
*/

// REST API

/*
CREATE 	- POST "/api/craps"
READ 	- GET "/api/craps"
UPDATE 	- PUT "/api/craps/:id"
DELETE 	- DELETE "/api/craps/:id"
*/

app.get("/api/craps", function(req, res) {
	return res.status(200).json(database);
})

app.post("/api/craps", function(req, res) {
	let craps = {
		eyecount:req.body.eyecount,
		passornot:req.body.passornot,
		id:id
	}
	id++;
	database.push(craps);
	return res.status(201).json(craps);
})

app.delete("/api/craps/:id", function(req, res) {
	let tempId = parseInt(req.params.id);
	let tempDatabase = database.filter(craps => craps.id !== tempId);
	database = tempDatabase;
	return res.status(200).json({"Message": "Success"});
})

app.listen(3000);

console.log("Running in port 3000");