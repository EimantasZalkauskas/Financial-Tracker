from flask import Flask
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