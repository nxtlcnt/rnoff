from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from gee_flood import analyze_flood

load_dotenv()

DEFAULT_POLARIZATION = os.getenv("POLARIZATION", "VH")
DEFAULT_PASS_DIRECTION = os.getenv("PASS_DIRECTION", "DESCENDING")
DEFAULT_THRESHOLD = float(os.getenv("THRESHOLD", 1.25))

app = Flask(__name__)

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "GEE OK"})

@app.route("/api/gee/flood", methods=["POST"])
def flood():
    try:
        data = request.get_json()
        geometry = data["geometry"]
        before_start = data["before_start"]
        before_end = data["before_end"]
        after_start = data["after_start"]
        after_end = data["after_end"]
        polarization = data.get("polarization", DEFAULT_POLARIZATION)
        pass_direction = data.get("pass_direction", DEFAULT_PASS_DIRECTION)
        threshold = float(data.get("difference_threshold", DEFAULT_THRESHOLD))

        result = analyze_flood(
            geometry, before_start, before_end,
            after_start, after_end,
            polarization, pass_direction, threshold
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500