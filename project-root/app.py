from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# Allow CORS for requests from the React frontend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Initialize OpenAI client with the API key from .env and AI/ML API base URL
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in .env file")

client = OpenAI(
    api_key=api_key,
    base_url="https://api.aimlapi.com/v1"  # Point to AI/ML API endpoint
)

# Function to get AI response using AI/ML API (via OpenAI SDK)
def get_ai_response(query, role='patient'):
    try:
        # Call AI/ML API using OpenAI SDK
        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Verify if AI/ML API supports this model
            messages=[
                {"role": "system", "content": f"You are Pulse AI, a heart health companion for a {role}. Your role is to assist users with heart health-related queries. Respond in a concise, empathetic, and actionable manner, using a friendly tone. If the query involves symptoms like chest pain, prioritize safety by suggesting emergency services for severe symptoms (e.g., severe pain, shortness of breath, sweating, nausea) and recommend consulting a doctor for milder cases. Optionally suggest using a Pulse AI device to monitor heart rate or oxygen levels if relevant. If the query is unrelated to heart health, gently steer the conversation back to heart health topics. Format your response as plain text without markdown or bullet points unless specifically needed for clarity."},
                {"role": "user", "content": query}
            ],
            max_tokens=100  # Reduced to encourage conciseness
        )
        response_text = response.choices[0].message.content.strip()
    except Exception as e:
        print(f"AI/ML API error: {str(e)}")
        response_text = f"Sorry, I encountered an issue while processing your request: {str(e)}. Please try again or ask a different question about your heart health."

    return {"text": response_text}

# API endpoint for text queries
@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        query = data.get('query')
        role = data.get('role', 'patient')

        if not query:
            return jsonify({"error": "Missing query"}), 400

        response = get_ai_response(query, role)
        return jsonify({"response": response["text"]})
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# API endpoint for file uploads
@app.route('/api/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        role = request.form.get('role', 'patient')

        if not file.filename.endswith('.csv'):
            return jsonify({"error": "Please upload a .csv file with ECG data."}), 400

        query = f"I am uploading an ECG file as a {role}."
        response = get_ai_response(query, role)
        return jsonify({"response": response["text"]})
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)