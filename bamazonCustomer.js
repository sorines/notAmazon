var mysql = require("mysql");
var inquirer = require("inquirer");
var prompt = require("prompt");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Schism2@",
  database: "bamazondb"
});


connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  runSearch();
  // idSearch();

});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Find product by ID",
        "How many would you like to buy?",

      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Find product by ID":
          idSearch();
          break;

        case " How many products you want to buy":
          rangeSearch();
          break;

        //    // case "Find data within a specific range":
        //       rangeSearch();
        //       break;

        //     case "Search for a specific song":
        //       songSearch();
        //       break;

        //     case "Find artists with a top song and top album in the same year":
        //       songAndAlbumSearch();
        //       break;
      }
    });
}

function idSearch() {
  inquirer
    .prompt({
      name: "item_id",
      type: "input",
      message: "Find Product by ID",
      choices: [
        "Find product by ID",
        "How many would you like to buy?",

      ]
    })
    .then(function (answer) {
      // var query = "SELECT * FROM products WHERE ?";
      connection.query("SELECT * FROM products WHERE ?", { item_id: answer.item_id }, function (err, res) {
        // for (var i = 0; i < res.length; i++) {
        console.log("ID: " + res[0].item_id + " || product_name: " + res[0].product_name
        );
        // }
        //run the id search now, please. 
        // idSearch();
        //this stops the search after i find the stupid id.
        runSearch();
      });
    });


  function rangeSearch() {
    inquirer
      .prompt([
        {
          name: "start",
          type: "input",
          message: "Product ID: ",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "end",
          type: "input",
          message: "How many do you need?: ",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function (answer) {
        var query = "SELECT item_id, product_name,stock_quantity FROM bamazon WHERE id BETWEEN ? AND ?";
        connection.query(query, [answer.start, answer.end], function (err, res) {
          for (var i = 0; i < res.length; i++) {
            console.log(
              "Id: " +
              res[i].item_id +
              " || Product: " +
              res[i].product_name +
              " || How much is left?: " +
              res[i].stock_quantity
            );
            // rangeSearch();
          }
          runSearch();
        });

      });
  }
}