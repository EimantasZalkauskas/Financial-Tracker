from flask import jsonify, request, redirect, session, render_template,url_for
from passlib.hash import pbkdf2_sha256
from datetime import datetime
from collections import defaultdict
import uuid

from app import client
db = client["financial-tracker"]

class User:

    def start_session(self, user):
        del user["password"]
        session["logged_in"] = True
        session["user"] = user
        
        return jsonify(user), 200

    def login(self):
        
        user = db.users.find_one({
            "email": request.form.get("email")
        })

        print(user)

        if user and pbkdf2_sha256.verify(request.form.get("password"), user["password"]):
            return self.start_session(user)
        return jsonify({"error": "Invalid Credentials"}), 401

    def signup(self):

        user = {
            "_id": uuid.uuid4().hex,
            "email": request.form.get("email"),
            "password": request.form.get("password")
        }

        #encrypt password 
        user["password"] = pbkdf2_sha256.encrypt(user["password"])

        #check if email not in db
        if db.users.find_one({"email": user["email"]}):
            return jsonify({"error": "Email address already in use"}), 400


        if db.users.insert_one(user):
            return self.start_session(user)
        
        return jsonify({"error": "Signup failed"}), 400
    
    def signout(self):
        session.clear()
        return redirect("/")

    #Methods for processing data
    #
    #Save Methods
    def save_expense(self, name, type, amount):
        currentMonth = datetime.now().month
        currentYear = datetime.now().year
        print(name, type, amount)
        print(session["user"]["_id"])

        expense = {
            "_id": uuid.uuid4().hex,
            "user_id": session["user"]["_id"],
            "name": name,
            "type": type,
            "amount": amount,
            "date": str(currentMonth) +"-"+str(currentYear)
        }

        #print(expense)

        db.payments.insert_one(expense)

        current_items = list(db.payments.find({"date":str(currentMonth) +"-"+str(currentYear), 
                                               "user_id": session["user"]["_id"]}))

        print(current_items)
        return redirect("/dashboard")
    
    def save_income(self, name, type, amount):
        currentMonth = datetime.now().month
        currentYear = datetime.now().year
        print(name, type, amount)
        print(session["user"]["_id"])

        income = {
            "_id": uuid.uuid4().hex,
            "user_id": session["user"]["_id"],
            "name": name,
            "type": type,
            "amount": amount,
            "date": str(currentMonth) +"-"+str(currentYear)
        }


        db.income.insert_one(income)

        current_items = list(db.income.find({"date":str(currentMonth) +"-"+str(currentYear), 
                                               "user_id": session["user"]["_id"]}))

        print(current_items)
        return redirect("/dashboard")
    #Delete
    def delete_item_payment(self, name, type, amount, date):
        db.payments.find_one_and_delete({"name":name,
                                        "type":type,
                                        "amount":amount,
                                        "date":date,
                                        "user_id":session["user"]["_id"]})
        
        return redirect("/dashboard")

    def delete_item_income(self, name, type, amount, date):
        db.income.find_one_and_delete({"name":name,
                                        "type":type,
                                        "amount":amount,
                                        "date":date,
                                        "user_id":session["user"]["_id"]})
        
        return redirect("/dashboard")
    
    #Get Methods
    def get_expenses(self, date):
        current_items = list(db.payments.find({"date":date, 
                                               "user_id": session["user"]["_id"]}, 
                                               {"type": 1,
                                                "amount": 1,
                                                "_id": 0}))
        
        items = self.conbime_items_arr(current_items)

        return items
    
    def get_income(self, date):
        current_items = list(db.income.find({"date":date, 
                                               "user_id": session["user"]["_id"]}, 
                                               {"type": 1,
                                                "amount": 1,
                                                "_id": 0}))
        
        items = self.conbime_items_arr(current_items)

        return items
    
    def conbime_items_arr(self, current_items):
        pairs = {}
        for item in current_items:
            
            if item["type"] in pairs:
                current_amount = pairs[item["type"]]
                pairs[item["type"]] = int(item["amount"]) + int(current_amount)
            else:
                pairs[item["type"]] = item["amount"]
        return pairs
            
                