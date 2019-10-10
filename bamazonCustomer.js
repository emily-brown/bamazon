const mysql = require("mysql")
const inquirer = require("inquirer")

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err
        // run the displayInventory function after the connection is made to prompt the user
    displayInventory()
});

let displayInventory = () => {
    //console.table("SQL Connection Established")
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            console.table(" - - - - - - - - - - - - - - - ")
            console.table("item number: " + res[i].item_id)
            console.table("item: " + res[i].product_name)
            console.table("price: $" + res[i].price)
        }
        purchase()
    })
};

// validateInput makes sure that the user is supplying only positive integers for their inputs
let validateInput = (value) => {
    var integer = Number.isInteger(parseFloat(value))
    var sign = Math.sign(value)

    if (integer && (sign === 1)) {
        return true;
    } else {
        return 'Please enter a whole non-zero number.'
    }
}

// purchase function to prompt the customer for an item to purchase
let purchase = () => {
    inquirer.prompt([{
                type: "input",
                name: "item_id",
                message: "Select the item you would like to purchase by item number.",
                validate: validateInput,
                filter: Number
            },
            {
                type: "input",
                name: "quantity",
                message: "How many of this item would you like to purchase?",
                validate: validateInput,
                filter: Number
            }
        ])
        .then(function(purchase) {
            let item = purchase.item_id
            let quantity = purchase.quantity

            let queryStr = 'SELECT * FROM products WHERE ?';

            connection.query(queryStr, { item_id: item }, function(err, res) {
                if (err) throw err

                if (res.length === 0) {
                    console.table("ERROR: Invalid Item ID. Please select a valid Item ID.")
                    displayInventory()
                } else {

                    // set the results to the variable of productInfo
                    let productInfo = res[0]

                    if (quantity <= productInfo.stock_quantity) {
                        console.table(productInfo.product_name + "is in stock! Placing order now!")
                        console.table("\n")

                        // the updating query string
                        var updateQueryStr = "UPDATE products SET stock_quantity = " + (productInfo.stock_quantity - quantity) + " WHERE item_id = " + item
                            // console.table('updateQueryStr = ' + updateQueryStr);

                        // Update the inventory
                        connection.query(updateQueryStr, function(err, data) {
                            if (err) throw err;

                            console.table("Your order has been placed!");
                            console.table("Your total is $" + productInfo.price * quantity)
                            console.table("Thank you for shopping with bamazon!")
                            console.table(" - - - - - - - - - - - - - - - ")
                            console.table("To shop again with us please input 'node bamazonCustomer.js' into your command line again.")
                            console.table("\n")

                            // End the database connection and close the app
                            connection.end();
                        })
                    } else {
                        console.table("Sorry, there is not enough " + productInfo.product_name + " in stock.")
                        console.table("Your order can not be placed as is.")
                        console.table("Please modify your order or select another item.")
                        console.table("\n")

                        // After 3 seconds display the inventory again so that the customer can make a new selcetion.
                        setTimeout(function() { displayInventory() }, 3000)
                    }


                }
            })


        })
}