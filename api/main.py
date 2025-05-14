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

# Keep the original route
@app.route("/api/gee/flood", methods=["POST"])
def flood():
    return process_flood_request()

# Add an additional route that matches what the server is receiving
@app.route("/flood", methods=["POST"])
def flood_alternate():
    return process_flood_request()

def process_flood_request():
    try:
        data = request.get_json()
        print("📥 Payload Diterima:", data)

        geometry = data["geometry"]
        before_start = data["before_start"]
        before_end = data["before_end"]
        after_start = data["after_start"]
        after_end = data["after_end"]
        polarization = data.get("polarization", DEFAULT_POLARIZATION)
        pass_direction = data.get("pass_direction", DEFAULT_PASS_DIRECTION)
        threshold = float(data.get("difference_threshold", DEFAULT_THRESHOLD))

        print("📊 Params:")
        print(f"  - Geometry type: {geometry['type']}")
        print(f"  - Dates: {before_start} → {after_end}")
        print(f"  - Polarization: {polarization}")
        print(f"  - Threshold: {threshold}")

        result = analyze_flood(
            geometry, before_start, before_end,
            after_start, after_end,
            polarization, pass_direction, threshold
        )

        print("✅ ANALYSIS DONE!")
        return jsonify(result)

    except Exception as e:
        import traceback
        print("❌ ERROR IN PROCESSING:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Optional: show helpful error on 404
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Route not found", "path": request.path}), 404