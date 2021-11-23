const express = require("express");
const mysql = require('mysql');
const app = express();
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));
 

//routes
app.get('/', async (req, res) => {
  
  let sql = `SELECT authorId, firstName, lastName FROM q_authors ORDER BY firstName`;
  let aut = await executeSQL(sql); 

  let sqlC = "SELECT DISTINCT category FROM q_quotes";
  let cat = await executeSQL (sqlC);
   res.render('index', {"authors":aut, "cate":cat})
});

app.get('/searchByAuthor', async (req, res) => {
  //searching quotes by authorId
  let author_id = req.query.authorId;

  let sql = `SELECT firstName, lastName, quote, authorId FROM q_authors NATURAL JOIN q_quotes WHERE authorId = ${author_id}`;

  let rows = await executeSQL(sql);

  // console.log(author_id);
  res.render('results', {"quotes":rows})
});

app.get('/searchByKeyword', async (req, res) => {
let keyword = req.query.key;
let sql = `SELECT q.quote, a.firstName, a.lastName, a.authorId FROM q_authors a NATURAL JOIN q_quotes q WHERE q.quote LIKE '%${keyword}%' `;
let data = await executeSQL(sql);
res.render ('results', {'quotes':data})
});

app.get('/searchByCategory', async (req, res) => {
  let category = req.query.category;

  let sql = `SELECT q.quote, a.firstName, a.lastName, a.authorId FROM q_quotes q NATURAL JOIN q_authors a WHERE q.category = '${category}' ORDER BY quote`;
  let data = await executeSQL(sql);
  res.render('results', { 'quotes' : data});
});

app.get('/searchByLikes', async (req, res) => {

let startlike = req.query.startlike;
let endlike = req.query.endlike;
let sql = `SELECT q.quote, a.firstName, a.lastName, q.likes, a.authorId FROM q_quotes q NATURAL JOIN q_authors a WHERE q.likes between ${startlike} and ${endlike} ORDER BY quote `;
let data = await executeSQL(sql);
res.render("results", {"quotes":data});
});


app.get('/api/authorInfo', async (req, res) => {
  //searching quotes by authorId
  let author_id = req.query.authorId; 

  let sql = `SELECT * FROM q_authors WHERE authorId = ${author_id}`;

  let rows = await executeSQL(sql);

  // console.log(author_id);
  res.send(rows);
});



app.get("/dbTest", async function(req, res){
let sql = "SELECT CURDATE()";
let rows = await executeSQL(sql);
res.send(rows);
});//dbTest

//functions
async function executeSQL(sql, params){
return new Promise (function (resolve, reject) {
pool.query(sql, params, function (err, rows, fields) {
if (err) throw err;
   resolve(rows);
});
});
}//executeSQL
//values in red must be updated
function dbConnection(){

   const pool  = mysql.createPool({

      connectionLimit: 10,
      host: "en1ehf30yom7txe7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "ereykugv8x71l19a",
      password: "b07s5nj02g91h4pi",
      database: "lvkilyr9brjlhyjo"

   }); 

   return pool;

} //dbConnection

//start server
app.listen(3000, () => {
console.log("Expresss server running...")
} )