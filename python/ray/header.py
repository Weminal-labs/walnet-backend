# This server will be served on Ubuntu
# or linux based server

from flask import Flask, request, jsonify
import ray

work_dir="/home/root"

# Define a task
@ray.remote
def example_task(data):
    # Perform some computation
    result = data ** 2
    return result

app = Flask(__name__)

# Define the /trigger-task endpoint
@app.route('/trigger-task', methods=['POST'])
def trigger_task():
    data = request.json.get("data")
    if data is None:
        return jsonify({"error": "No data provided"}), 400

    # Submit the task to RayQ
    task_result = example_task.remote(data)

    # Optionally, you could wait for the result here or return task ID
    result = ray.get(task_result)
    return jsonify({"status": "Task completed", "result": result}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9000)
