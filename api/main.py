from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/", methods=["GET"])
def model_check():
    return jsonify({"status": "GEE OK"})
