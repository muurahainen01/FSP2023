var mode = 0;

window.onload = function() {
	//Random number
	const random = randomEyeCount();
	createRootForm();
}

randomEyeCount = () => {
	random = parseInt((Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1));
	return random;
}

createRootForm = () => {
	//root and form preparing
	let root = document.getElementById("root");
	let form = document.createElement("form");
	form.setAttribute("id","rootForm");
	form.setAttribute("class","m-3");
	
	//empty root form
	const oldRootForm = document.getElementById("rootForm");
	if(oldRootForm) {
		root.removeChild(oldRootForm);
	}
	const rootForm = document.createElement("rootForm");
	rootForm.setAttribute("id","rootForm");
	rootForm.setAttribute("class","table table-striped");
	
	//empty table
	const oldTable = document.getElementById("table");
	if (oldTable) {
		root.removeChild(oldTable);
	}
	const table = document.createElement("table");
	table.setAttribute("id","table");
	table.setAttribute("class","table table-striped");
	//empty reset form
	const oldResetForm = document.getElementById("resetForm");
	if (oldResetForm) {
		root.removeChild(oldResetForm);
	}
		
	//eye count input and label
	const random = randomEyeCount();
	let rootEyeCountInput = document.createElement("input");
	rootEyeCountInput.setAttribute("type","text");
	rootEyeCountInput.setAttribute("id","rooteyecount");
	rootEyeCountInput.setAttribute("value",random);
	rootEyeCountInput.setAttribute("class","form-control");
	rootEyeCountInput.setAttribute("name","rooteyecount");
	rootEyeCountInput.readonly = true;
	rootEyeCountInput.style.display = "none";
	let rootEyeCountLabel = document.createElement("label");
	rootEyeCountLabel.setAttribute("for","eyecount");
	rootEyeCountLabel.setAttribute("class","form-label");
	let rootEyeCountText = document.createTextNode("Eye Count");
	rootEyeCountLabel.appendChild(rootEyeCountText);
	rootEyeCountLabel.style.display = "none";

	//pass button
	let passButton = document.createElement("input");
	passButton.setAttribute("type","button");
	passButton.setAttribute("id","passbutton");
	passButton.setAttribute("value","Pass");
	passButton.setAttribute("class","btn btn-primary");
	passButton.setAttribute("name","pass");
	
	//don't pass button
	let dontPassButton = document.createElement("input");
	dontPassButton.setAttribute("type","button");
	dontPassButton.setAttribute("id","dontpassbutton");
	dontPassButton.setAttribute("value","Don't pass");
	dontPassButton.setAttribute("class","btn btn-primary");
	dontPassButton.setAttribute("name","dontpass");
	
	
	//append to form
	form.append(rootEyeCountLabel,rootEyeCountInput,passButton,dontPassButton);
	passButton.addEventListener("click",function(e) {
		e.preventDefault();
		passEyeCount(random);
	});
	dontPassButton.addEventListener("click",function(e) {
		e.preventDefault();
		dontPassEyeCount(random);
	});
	
	//append form to root form
	rootForm.appendChild(form);
	
	//append root form to root
	root.appendChild(rootForm);
}

//REST API

//////// Pass eye count
passEyeCount = async () => {
	//add pass eye count to json
	const rootEyeCountInput = document.getElementById("rooteyecount");
	const randCount = rootEyeCountInput.value;
	const throwDice = {
		"eyecount": randCount,
		"passornot": true
	}
	let url = "/api/craps"
	let request = {
		method:"POST",
		headers:{"Content-Type":"application/json"},
		body:JSON.stringify(throwDice)
	}
	const response = await fetch(url,request);
	if(response.ok) {
		console.log("Add eye count success.");
		getEyeCount();
		const passbutton = document.getElementById("passbutton");
		passbutton.value= "Pass";
		mode = 0;
	} else {
		console.log("Add eye count failed. Server responded with a status "+response.status+" "+response.statusText)
	}
}

//////// Don't pass eye count
dontPassEyeCount = async () => {
	//add don't pass eye count to json
	const rootEyeCountInput = document.getElementById("rooteyecount");
	const randCount = rootEyeCountInput.value;
	const throwDice = {
		"eyecount": randCount,
		"passornot": false
	}
	let url = "/api/craps"
	let request = {
		method:"POST",
		headers:{"Content-Type":"application/json"},
		body:JSON.stringify(throwDice)
	}
	const response = await fetch(url,request);
	if(response.ok) {
		console.log("Add eye count success.");
		getEyeCount();
		const dontpassbutton = document.getElementById("dontpassbutton");
		dontpassbutton.value= "Don't pass";
		mode = 0;
	} else {
		console.log("Add eye count failed. Server responded with a status "+response.status+" "+response.statusText)
	}
}

////////// REST API
getEyeCount = async () => {
	//get json data
	const request = {
		method:"GET"
	}
	const response = await fetch("/api/craps",request);
	if(response.ok) {
		const list = await response.json();
		createRootForm();
		createForm(list);
	} else {
		console.log("Get pass list failed. Server responded with a status "+response.status+" "+response.statusText);
	}
}

removeAll = async (data) => {
	//remove json data
	let j = 0;
	for (let i=0;i<data.length;i++) {
		for (x in data[i]) {
			if (x === "id") {
				id = data[i][x];
				console.log(id);
				const request = {
					method:"DELETE"
				}
				const response = await fetch("/api/craps/"+id,request);
				if(response.ok) {
					getEyeCount();
				} else {
					console.log("Remove contact failed. Server responded with a status "+response.status+" "+response.statusText)
				}
			}
		}
	}
}

//////Create Form
createForm = (data) => {	
	//random number
	const random = randomEyeCount();
	//set pass or don't pass variable
	for (x in data[data.length - 1]) {
		if (x === "passornot") {
			passOrNot = data[data.length - 1][x];
		}
	}
	//show pass of don't pass button and populate that
	if (data.length > 0) {
		const passButton = document.getElementById("passbutton");
		const dontPassButton = document.getElementById("dontpassbutton");
		if (passOrNot === true) {
			passButton.style.display = "block";
			dontPassButton.style.display = "none";
		} else {
			passButton.style.display = "none";
			dontPassButton.style.display = "block";
		}
		populateTable(data, passOrNot);
	}
}

//////Populate
populateTable = (data, passOrNot) => {
	//create or renew root and table
	const root = document.getElementById("root");
	const oldTable = document.getElementById("table");
	if(oldTable) {
		root.removeChild(oldTable);
	}
	const table = document.createElement("table");
	table.setAttribute("id","table");
	table.setAttribute("class","table table-striped");
	
	//table headers
	const header = document.createElement("thead");
	const headerRow = document.createElement("tr");
	const eyeCountHeader = document.createElement("th");
	const eyeCountText = document.createTextNode("Eye Count");
	eyeCountHeader.appendChild(eyeCountText);
	const statusHeader = document.createElement("th");
	const statusText = document.createTextNode("Status");
	statusHeader.appendChild(statusText);
	headerRow.append(eyeCountHeader, statusHeader);
	header.appendChild(headerRow);
	table.appendChild(header);
	//table body
	const body = document.createElement("tbody");
	const dataEyeCount = 0;
	let j = 0;
	for (let i=0;i<data.length;i++) {
		//table row
		const tableRow = document.createElement("tr");
		for (x in data[i]) {
			//table data
			if (x === "id") {
				continue;
			} else if (x === "eyecount") {
				//eye count
				let column = document.createElement("td");
				const dataEyeCount = parseInt(data[i][x]);
				const info = document.createTextNode(data[i][x]);
				column.appendChild(info);
				tableRow.appendChild(column);
				
				//status text
				column = document.createElement("td");
				const firstEyeCount = parseInt(data[0][x]);
				//test status with the condition set
				if (i < 1) {
					if (passOrNot === true) {
						j = passConditions(firstEyeCount, 0);
					} else {
						j = dontPassConditions(firstEyeCount, 0);
					}
				} else {
					if (passOrNot === true) {
						j = passConditions(firstEyeCount, dataEyeCount);
					} else {
						j = dontPassConditions(firstEyeCount, dataEyeCount);
					}
				}
				//convert the status id to the string, and set the string to table
				const s = getString(j);
				const won = document.createTextNode(s);
				column.appendChild(won);
				tableRow.appendChild(column);
			} else {
				//pass or don't pass
				continue;
			}
		}
		//append table row to body
		body.appendChild(tableRow)
	}
	//append body to table
	table.appendChild(body);
	//append table to root
	root.appendChild(table);
	
	//if finish reset game
	const resetForm = finishReset(j, data);
	if (resetForm) {
		root.appendChild(resetForm);
	}
	
	//let's perform the next roll
	if (passOrNot === true) {
		let passButton = document.getElementById("passbutton");
		passButton.addEventListener("click",function(e) {
			e.preventDefault();
			createRootForm();
		});
	} else {
		let dontPassButton = document.getElementById("dontpassbutton");
		dontPassButton.addEventListener("click",function(e) {
			e.preventDefault();
			createRootForm();
		});
	}
}

//pass conditions
passConditions = (eyecount, dataeyecount) => {
	eyecount = parseInt(eyecount);
	dataeyecount = parseInt(dataeyecount);
	let i = 0;
	if (dataeyecount === 0) {
		if (eyecount === 7 || eyecount === 11) {
			i = 1; // won
		} else if (eyecount === 2 || eyecount === 3 || eyecount === 12) {
			i = 2; // lost
		} else {
			i = 3; // point
		}
	}
	else {
		if (eyecount === dataeyecount) {
			i = 1; // won
		} else if (dataeyecount === 7) {
			i = 2; // lost
		} else {
			i = 4; // reroll
		}
	}
	return i;
}

//don't pass conditions
dontPassConditions = (eyecount, dataeyecount) => {
	eyecount = parseInt(eyecount);
	dataeyecount = parseInt(dataeyecount);
	let i = 0;
	if (dataeyecount === 0) {
		if (eyecount === 7 || eyecount === 11) {
			i = 2; // lost
		} else if (eyecount === 2 || eyecount === 3) {
			i = 1; // won
		} else if (eyecount === 12) {
			i = 5; // money back
		} else {
			i = 3; // point
		}
	}
	else {
		if (eyecount === dataeyecount) {
			i = 2; // lost
		} else if (dataeyecount === 7) {
			i = 1; // won
		} else {
			i = 4; // reroll
		}
	}
	return i;
}

//set string about the status variable
getString = (i) => {
	if (i === 1) {
		return("You won!");
	} else if (i === 2) {
		return("You lost!");
	} else if (i === 3) {
		return("You got point. Reroll.");
	} else if (i === 4) {
		return("You got not original eye count or 7. Reroll.");
	} else if (i === 5) {
		return("You got money back.");
	}
}

//reset game form conditions
finishReset = (j, data) => {
	let resetForm = null;
	if (j === 1 || j === 2 || j === 5) {
		resetForm = resetGame(data);
	}
	j = 0;
	return resetForm;
}

//reset game form
resetGame = (data) => {
	//hide gaming buttons
	const passButton = document.getElementById("passbutton");
	const dontPassButton = document.getElementById("dontpassbutton");
	passButton.style.display = "none";
	dontPassButton.style.display = "none";
	//reset form
	let form = document.createElement("form");
	form.setAttribute("id","resetForm");
	form.setAttribute("class","m-3");
	//reset button
	let resetButton = document.createElement("input");
	resetButton.setAttribute("type","submit");
	resetButton.setAttribute("id","resetbutton");
	resetButton.setAttribute("value","Reset");
	resetButton.setAttribute("class","btn btn-primary");
	resetButton.setAttribute("name","reset");
	//append button to form
	form.appendChild(resetButton);	
	form.addEventListener("submit",function(e) {
		e.preventDefault();
		removeAll(data);
		createRootForm();
	});
	return form;
}