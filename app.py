from flask import Flask, render_template, session, redirect
from functools import wraps
from datetime import datetime
from pymongo.mongo_client import MongoClient



#App setup
app = Flask(__name__)
app.secret_key = 'b\x80I\xeb\xe3\x05\xd7\xce\x97\xcb@"!\xa5\'\xedF'
uri = "mongodb+srv://admin:m51h8fjjkbNiEgqN@financialtrackercluster.x327ltg.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)

#Routes
from user import routes


#DB
db = client["financial-tracker"]

#Decorators
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if "logged_in" in session:
            return f(*args, **kwargs)
        else:
            return redirect("/")
    return wrap

client.close()
#Main Routes
@app.get("/")
def index():
    return render_template("index.html")

@app.get("/dashboard")
@login_required
def dashboard():
    currentMonth = datetime.now().month
    currentYear = datetime.now().year
    current_items_expenses = list(db.payments.find({"date":str(currentMonth) +"-"+str(currentYear), 
                                           "user_id": session["user"]["_id"]}))
    current_items_income = list(db.income.find({"date":str(currentMonth) +"-"+str(currentYear), 
                                           "user_id": session["user"]["_id"]}))
    return render_template("dashboard.html", current_items_expenses=current_items_expenses, current_items_income=current_items_income, current_month=datetime.now().strftime("%B"), current_year=str(currentYear))


