var React = require('react');
var Link = require("react-router-dom").Link;
var useLoaderData = require("react-router-dom").useLoaderData;
var toast = require("react-toastify").toast;
var Register = require("../components/Register");
var AddBudgetForm = require("../components/AddBudgetForm");
var AddTransactionForm = require("../components/AddTransactionForm");
var BudgetProfile = require("../components/BudgetProfile");
var Table = require("../components/Table");
var AuthContext = require("../context/AuthContext");

var fetchData = function(key) {
  return fetch('http://localhost:8080/api/' + key)
    .then(response => response.json())
    .then(data => data);
};

var wait = function() {
  return new Promise(resolve => setTimeout(resolve, 1000));
};

var createBudget = function(budget) {
  return fetch('http://localhost:8080/api/budgets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget)
  })
    .then(response => response.json())
    .then(data => data);
};

var createTransaction = function(transaction) {
  return fetch('http://localhost:8080/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  })
    .then(response => response.json())
    .then(data => data);
};

var deleteItem = function(item) {
  return fetch('http://localhost:8080/api/' + item.key + '/' + item.id, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => data);
};

// loader
exports.dashboardLoader = function() {
  var userName = fetchData("userName");
  var budgets = fetchData("budgets"); 
  var transactions = fetchData("transactions");
  return {userName: userName, budgets: budgets, transactions: transactions}
}

// action
exports.dashboardAction = function(request) {
  return new Promise(function(resolve, reject) {
    wait().then(function() {
      var data = request.formData();
      var _action = data._action;
      var values = {};
      for (var key in data) {
        if (key !== "_action") {
          values[key] = data[key];
        }
      }
      
      // new user submission
      if (_action === "newUser") {
        try {
          localStorage.setItem("userName", JSON.stringify(values.userName));
          resolve(toast.success("Welcome, " + values.userName + "!"));
        } catch (e) {
          reject(new Error("There was a problem with your registration. Please try again."));
        }
      }

      // new budget submission
      if (_action === "createBudget") {
        try {
          // create budget
          createBudget({
            name: values.newBudgetName,
            amount: values.newBudgetAmount
          })
          resolve(toast.success("Budget created successfully"));
        } catch (e) {
          reject(new Error("There was a problem with your budget creation. Please try again."));
        }
      }

      if (_action === "createTransaction") {
        try {
          // create transaction
          createTransaction({
            budgetId: values.newTransactionBudget,
            name: values.newTransactionName,
            amount: values.newTransactionAmount,
          })
          resolve(toast.success("Transaction " + values.newTransactionName + " created!"));
        } catch (e) {
          reject(new Error("There was a problem with your transaction creation. Please try again."));
        }
      }

      if (_action === "deleteTransaction") {
        try {
          deleteItem({
            key: "transactions",
            id: values.transactionId // from form with hidden input
          })
          resolve(toast.success("Transaction deleted!"));
        } catch (e) {
          reject(new Error("There was a problem with your transaction deletion. Please try again."));
        }
      }
    });
  });
}

function DashboardPage() {
  var logout = AuthContext.logout;
  var loaderData = useLoaderData();
  var userName = loaderData.userName;
  var budgets = loaderData.budgets;
  var transactions = loaderData.transactions;
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h2",
      null,
      "Dashboard"
    ),
    React.createElement(
      "button",
      { onClick: logout },
      "Logout"
    ),
    userName ? React.createElement(
      "div",
      { className: "dashboard" },
      React.createElement(
        "h1",
        null,
        "Welcome back, ",
        React.createElement(
          "span",
          { className: "accent" },
          userName
        )
      ),
      React.createElement(
        "div",
        { className: "grid-sm" },
        budgets && budgets.length > 0 ? React.createElement(
          "div",
          { className: "grid-lg" },
          React.createElement(
            "div",
            { className: "flex-lg" },
            React.createElement(AddBudgetForm, null),
            React.createElement(AddTransactionForm, { budgets: budgets })
          ),
          React.createElement(
            "h2",
            null,
            "Existing Budgets"
          ),
          React.createElement(
            "div",
            { className: "budgets" },
            budgets.map(function(budget) {
              return React.createElement(BudgetProfile, { key: budget.id, budget: budget });
            })
          ),
          transactions && transactions.length > 0 ? React.createElement(
            "div",
            { className: "grid-md" },
            React.createElement(
              "h2",
              null,
              "Recent Transactions"
            ),
            React.createElement(Table, { transactions: transactions.sort(function(a, b) {
              return b.createdAt - a.createdAt;
            }).slice(0, 5) }),
            transactions.length > 5 ? React.createElement(
              Link,
              { to: "transactions", className: "btn btn--dark" },
              "View All Transactions"
            ) : null
          ) : null
        ) : React.createElement(
          "div",
          { className: "grid-sm" },
          React.createElement(
            "p",
            null,
            "Create a budget to get started!"
          ),
          React.createElement(AddBudgetForm, null)
        )
      )
    ) : React.createElement(Register, null)
  );
}

module.exports = DashboardPage;
