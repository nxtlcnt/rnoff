from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/gee/check", methods=["GET"])
def check():
    return jsonify({"status": "GEE OK"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8002)
