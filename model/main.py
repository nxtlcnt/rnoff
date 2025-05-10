from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/model/check", methods=["GET"])
def check():
    return jsonify({"status": "Model OK"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
