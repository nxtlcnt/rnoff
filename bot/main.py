from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/api/chatbot/check", methods=["GET"])
def check():
    return jsonify({"status": "Chatbot OK"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8001)
