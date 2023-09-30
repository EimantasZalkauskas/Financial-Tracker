from flask import Flask, request
from app import app
from user.models import User

#Signup
@app.route("/user/signup", methods=["GET","POST"])
def signup():
    return User().signup()

@app.route("/user/signout", methods=["GET","POST"])
def signout():
    return User().signout()
#Login
@app.route("/user/login", methods=["GET","POST"])
def login():
    return User().login()

#Submit
@app.route("/user/expenses/submit", methods=["POST"])
def save_input_expenses():
    name = request.form.get("ExpensesName")
    type = request.form.get("ExpensesType")
    amount = request.form.get("ExpensesAmount")
    return User().save_expense(name, type, amount)

@app.route("/user/income/submit", methods=["POST"])
def save_input_income():
    name = request.form.get("IncomeName")
    type = request.form.get("IncomeType")
    amount = request.form.get("IncomeAmount")
    return User().save_income(name, type, amount)
#Delete
@app.route("/user/expense/delete", methods=["POST"])
def del_input_expense():
    name = request.form.get("name")
    type = request.form.get("type")
    amount = request.form.get("amount")
    date = request.form.get("date")
    return User().delete_item_payment(name, type, amount, date)

@app.route("/user/income/delete", methods=["POST"])
def del_input_income():
    name = request.form.get("name")
    type = request.form.get("type")
    amount = request.form.get("amount")
    date = request.form.get("date")
    return User().delete_item_income(name, type, amount, date)

#Get
@app.route("/user/get/expenses", methods=["POST"])
def get_expenses():
    date = request.form.get("date")
    return User().get_expenses(date)

@app.route("/user/get/income", methods=["POST"])
def get_income():
    date = request.form.get("date")
    return User().get_income(date)