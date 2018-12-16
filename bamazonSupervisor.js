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

var bigquery = "select departments.department_id, departments.department_name, departments.over_head_costs, sum(products.product_sales) as total_sales, (  sum(products.product_sales) - departments.over_head_costs ) as total_profit from products right join departments on products.department_name = departments.department_name group by products.department_name, departments.department_id";

function run(){
    inquirer.prompt([
        {
            type: "list",
            name: "Choice",
            message: "Select action",
            choices: ["View sales by department", "Add new department", "Exit program"]
        }
    ]).then(function(answer) {
        switch (answer.Choice) {
            case "View sales by department":
                read();
                break;

            case "Add new department":
                addDepartment();
                break;
            
            case "Exit program":
                connection.end();
                break;
        }
    });
}

function read(){
        connection.query(bigquery, function(err, res){
            if (err) throw err;
            console.table(res);
            run();
        });
};

function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            name: "depName",
            message: "Department: ",
        },
        {
            type: "input",
            name: "over_head_costs",
            message: "Overhead costs: "
        }
    ]).then(function(answer){
        var query = "INSERT INTO departments (department_name, over_head_costs) VALUES ?";
        var values = [
            [answer.depName, answer.over_head_costs]
        ];
        connection.query(query, [values], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            run();
          });
    });
};