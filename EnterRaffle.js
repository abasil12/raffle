const fs = require('fs');

process.stdin.setEncoding("utf8");

let http = require('http');
let express = require("express");
let path = require("path");
let app = express();

let bodyParser = require('body-parser');

//let sql = require("/../Users/Anu Basil/Downloads/335 Final Project/PromisesFetch6/PromisesFetch6");

let reviewResult = "";
let tableResult = "";

let removed = 0;
// Put these statements before you define any routes.
//app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("dotenv").config({ path: path.resolve(__dirname, 'templates/.env') })

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

/* Our database and collection */
const databaseAndCollection = { db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_COLLECTION };

/****** DO NOT MODIFY FROM THIS POINT ONE ******/
const { MongoClient, ServerApiVersion } = require('mongodb');

async function main(name) {
	const uri = `mongodb+srv://${userName}:${password}@cluster0.ii9ui.mongodb.net/CMSC335_DB?retryWrites=true&w=majority`;
	//const uri = `mongodb+srv://abasil:flowers@cluster0.mmvm8.mongodb.net/CMSC335_DB?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    try {
        await client.connect();

        /*Inserting one movie */
		
		let entry = { name: name };
        await insertEntry(client, databaseAndCollection, entry);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

function processObject(json) {
    // Our response is an array of values
    console.log("\n\n***** Values Received *****\n");
    json.forEach(entry => console.log(entry.title));
}

async function insertEntry(client, databaseAndCollection, newMovie) {
    const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(newMovie);
    
}

//main().catch(console.error);

/*let bodyParser = require("body-parser"); */

app.use(express.json());

app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");


app.get("/", (request, response) => { response.render('index') });


app.post("/process", (request, response) => {
    //response.render('orderConfirmation');
    (async () => {
        let {name} = request.body;
        await main(name).catch(console.error);
        response.render('displayItems', { name: name });    
    })();
});

app.post("/getNames", (request, response) => {
    //response.render('orderConfirmation');
    (async () => {
        let { name } = request.body;
        await main(name).catch(console.error);
        response.render('orderConfirmation', { name: name });
    })();
});


http.createServer(app).listen(process.argv[2]);

process.stdout.write(`Web server is started and running at http://localhost:${process.argv[2]}`);

let prompt = "\nStop to shutdown the server: ";
process.stdout.write(prompt);

process.stdin.on('readable', function () {
	let dataInput = process.stdin.read();
	if (dataInput !== null) {
		let command = dataInput.trim();

		if (command === "stop") {
			process.stdout.write("Shutting down the server\n");
			process.exit(0);
		}
		process.stdin.resume();
	}
})




