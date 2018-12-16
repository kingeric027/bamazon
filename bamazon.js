var inquirer = require("inquirer");
var mysql = require("mysql");
var consoletable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Strafgif1",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    read();
  });
  

function inquire(){
        inquirer.prompt([
            {
              type: "input",
              name: "selectID",
              message: "Enter the ID of the product you would like to purchase",
            },
            {
                type: "input",
                name: "selectQuantity",
                message: "Enter the quantity that you would like to purchase",
                validate: validateInt
            }
          ]).then(function(answer) {
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, { item_id: answer.selectID }, function(err, res) {
                if(parseInt(answer.selectQuantity)>parseInt(res[0].stock_quantity)){
                    console.log("Error, not enough in stock");
                    inquire();
                }else{
                    var cost = parseInt(answer.selectQuantity)*parseInt(res[0].price);
                    console.log("Order complete. Total cost: " + "$"+ cost);
                    update(answer.selectID, 
                        res[0].stock_quantity - parseInt(answer.selectQuantity),
                        res[0].product_sales + cost);
                    purchaseMore();
            }
        });
    });
};

function read(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        //for (var i = 0; i < res.length; i++) {
        //    console.log(
        //      "Item ID: " +
        //        res[i].item_id +
        //        " || Product: " +
        //        res[i].product_name +
         //       " || Department: " +
         //       res[i].department_name +
         //       " || Price: " +
         //       res[i].price + 
         //       " || In stock: " +
         //       res[i].stock_quantity
         //   );
         // }
        console.table(res);
        inquire();
    })
};

function purchaseMore(){
    inquirer.prompt([
        {
            type: "list",
            name: "Again",
            message: "Would you like to make another purchase?",
            choices: ["Yes", "No"]
        }
    ]).then(function(answer) {
        if(answer.Again == "Yes"){
            read();
        }else{
            console.log("Thank you");
            connection.end();
        }
    })
};

function update(id, quantity, sales){
    var query = "UPDATE products SET ?, ?  WHERE ?";
    connection.query(query, [
        { 
            stock_quantity: quantity
        }, 
        {
            product_sales: sales
        },
        {
            item_id: id
        } 
        ], function(err){
        if (err) throw err;
    });
};

function validateInt(value){
    var num = parseFloat(value);
    //check if value is intiger that is greater than 0
    if(Number.isInteger(num) && num>0){
        return true;
    } else{
        return "Please enter a valid number"
    }
};
