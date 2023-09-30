from flask import Flask, request
from app import app
from user.models import User


@app.route("/user/signup", methods=["GET","POST"])
def signup():
    return User().signup()

@app.route("/user/signout", methods=["GET","POST"])
def signout():
    return User().signout()

@app.route("/user/login", methods=["GET","POST"])
def login():
    return User().login()

@app.route("/user/expenses/submit", methods=["POST"])
def save_input():
    name = request.form.get("Name")
    type = request.form.get("Type")
    amount = request.form.get("Amount")
    return User().save_expense(name, type, amount)

@app.route("/user/expense/delete", methods=["POST"])
def del_inputs():
    name = request.form.get("name")
    type = request.form.get("type")
    amount = request.form.get("amount")
    date = request.form.get("date")
    return User().delete_items(name, type, amount, date)