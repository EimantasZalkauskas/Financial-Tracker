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


# Dashboard Routes

#Submit
@app.route("/user/expenses/submit", methods=["POST"])
def save_input_expenses():
    name = request.form.get("name")
    type = request.form.get("type")
    amount = request.form.get("amount")
    month = request.form.get("month")
    year = request.form.get("year")
    return User().save_expense(name, type, amount, month, year)

@app.route("/user/income/submit", methods=["POST"])
def save_input_income():
    name = request.form.get("name")
    type = request.form.get("type")
    amount = request.form.get("amount")
    month = request.form.get("month")
    year = request.form.get("year")
    return User().save_income(name, type, amount, month, year)
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


# Profile Routes

@app.route("/user/get/totals/expenses", methods=["POST"])
def get_profile_expenses():
    date1 = request.form.get("date1")
    date2 = request.form.get("date2")
    date3 = request.form.get("date3")
    date4 = request.form.get("date4")
    date5 = request.form.get("date5")
    date6 = request.form.get("date6")
    return User().get_profile_expenses_totals([date1, date2, date3, date4, date5, date6])

@app.route("/user/get/totals/income", methods=["POST"])
def get_profile_income():
    date1 = request.form.get("date1")
    date2 = request.form.get("date2")
    date3 = request.form.get("date3")
    date4 = request.form.get("date4")
    date5 = request.form.get("date5")
    date6 = request.form.get("date6")
    return User().get_profile_income_totals([date1, date2, date3, date4, date5, date6])


@app.route("/update/precentages/", methods=["POST"])
def update_precentages():
    needs = request.form.get("needs")
    wants = request.form.get("wants")
    savings = request.form.get("savings")

    return User().update_precentages(needs, wants, savings)

@app.route("/get/precentages/", methods=["POST"])
def get_precentages():
    return User().get_precentages()