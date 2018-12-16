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
    run();
});

function run(){
    inquirer.prompt([
        {
            type: "list",
            name: "Choice",
            message: "Select action",
            choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product"]
        }
    ]).then(function(answer) {
        switch (answer.Choice) {
            case "View products for sale":
                read();
                break;

            case "View low inventory":
                readLow();
                break;
            
            case "Add to inventory":
                addInventory();
                break;
            
            case "Add new product":
                addProduct();
                break;
        }
    });
}





function read(){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        //for (var i = 0; i < res.length; i++) {
        //    console.log(
        //      "Item ID: " +
        //        res[i].item_id +
        //        " || Product: " +
        //        res[i].product_name +
        //        " || Department: " +
        //        res[i].department_name +
        //        " || Price: " +
        //        res[i].price + 
        //        " || In stock: " +
        //        res[i].stock_quantity
        //    );
        //  }
        console.table(res);
        run();
    })
};
  

function readLow(){
    var query = "SELECT * FROM products WHERE stock_quantity BETWEEN ? AND ?";
    connection.query(query, [0, 5], function(err, res){
        if (err) throw err;
        //for (var i = 0; i < res.length; i++) {
        //    console.log(
        //      "Item ID: " +
        //        res[i].item_id +
        //        " || Product: " +
        //        res[i].product_name +
        //        " || Department: " +
        //        res[i].department_name +
        //        " || Price: " +
        //        res[i].price + 
        //        " || In stock: " +
        //        res[i].stock_quantity
        //    );
        //  }
        console.table(res);
        run();
    })
};

function addInventory(){
    inquirer.prompt([
        {
            type: "input",
            name: "selectID",
            message: "Enter the ID of the product you would like to increase inventory of",
        },
        {
            type: "input",
            name: "amount",
            message: "How many units would you like to add to the inventory?",
            validate: validateFloat
        }
    ]).then(function(answer) {
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { item_id: answer.selectID }, function(err, res) {

            connection.query("UPDATE products SET ? WHERE ?", [
            { 
                stock_quantity: res[0].stock_quantity + parseInt(answer.amount)
            },
            {
                item_id: answer.selectID
            } 
            ],function(err){
            if (err) throw err;
            });
            run();
        });
        console.log("Inventory updated");
    });
};

function addProduct(){
    inquirer.prompt([
        {
            type: "input",
            name: "prodName",
            message: "Product: ",
        },
        {
            type: "input",
            name: "depName",
            message: "Department: "
        },
        {
            type: "input",
            name: "price",
            message: "Price: "
        },
        {
            type: "input",
            name: "quantity",
            message: "Quantity in stock: ",
            validate: validateInt 
        }
    ]).then(function(answer){
        var query = "INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales) VALUES ?";
        var values = [
            [answer.prodName, answer.depName, parseInt(answer.price), parseInt(answer.quantity), 0]
        ];
        connection.query(query, [values], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            run();
          });
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

function validateFloat(value){
    var num = parseFloat(value);
    if(isNaN(num)){
        return "Please enter a valid price"
    } else{
        return true;
    }
    
};