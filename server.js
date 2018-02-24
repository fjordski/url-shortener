const express = require('express');
const Hash = require('./modules/hash');
const app = express();
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

// write defaults
db.defaults({ posts: [], user: {}, count: 0, urls: [] })
  .write()

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/urls", function (request, response) {
  const dbUrls=[];
  const urls = db.get('urls').value();
  urls.forEach(function(url) {
    dbUrls.push(url); 
  });
  response.send(urls); 
});

// creates a new entry in the urls collection with the submitted values
app.post("/urls", async (request, response) => {
  const hash = new Hash();
  
  function createId() {
    const id = hash.hashString(); 
    return id;
  }

  async function pushURL() {
    const id = createId();
    const exists = await db.get('urls').find({ id: id }).value();
    
    if (!exists) {
      db.get('urls')
        .push({ url: request.query.urlName, id: id })
        .write()
        response.sendStatus(200);
        console.log(`New url: ${request.query.urlName} with id: ${id} inserted into the database`);
    } else {
      pushURL();
    }
  }
  
  pushURL()
    .catch(reason => console.log(reason.message))
});

// redirects to url stored in db based on pased id
app.get('/:id', async (req, res) => {
  const urlId = req.params.id;
  const urls = await db.get('urls').find({ "id": urlId }).value();
  res.redirect(`http://${urls.url}`);
});

// removes all entries from the collection
app.get("/clear", function (request, response) {
  db.get('urls')
  .remove()
  .write()
  console.log("Database cleared");
  response.redirect("/");
});

const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
