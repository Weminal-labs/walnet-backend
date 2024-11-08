# This server will be served on Ubuntu
# or linux based server

from flask import Flask, request, jsonify
import ray

app = Flask(__name__)

# Define the /trigger-task endpoint
@app.route('/trigger-join-cluster', methods=['POST'])
def trigger_task():
    try:
        data = request.json.get("data")
        if data is None:
            return jsonify({"error": "No data provided"}), 400

        cluster_ip = data['clusterIp']
        cluster_port = data['clusterPort']

        result = ray.init(f"ray://{cluster_ip}:{cluster_port}")

        return jsonify({"status": "Node has joined to a cluster", "result": result}), 200
    except Exception as e:
        return jsonify({"status": "Node could not join to a cluster", "result": result}), 400

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9001)
