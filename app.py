from flask import Flask, render_template
from pymongo.mongo_client import MongoClient

app = Flask(__name__, static_folder="static")
uri = "mongodb+srv://admin:m51h8fjjkbNiEgqN@financialtrackercluster.x327ltg.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)


db = client["financial-tracker"]
collection = db["users"]
print(collection.find_one())


# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)
client.close()
@app.get("/")
def index():
    return render_template("index.html")