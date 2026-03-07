from flask import Flask,request,jsonify
from flask_cors import CORS
from services.prediction_service import predict_demand,predict_delay

app = Flask(__name__)
CORS(app)   # Enable CORS


@app.route("/")
def home():
    return "Supply Chain AI Platform Running"


@app.route("/predict-demand",methods=["POST"])
def demand():

    data = request.json

    prediction = predict_demand(data)

    return jsonify({
        "predicted_demand":prediction
    })


@app.route("/predict-delay",methods=["POST"])
def delay():

    data = request.json

    prediction = predict_delay(data)

    return jsonify({
        "delay_prediction":prediction
    })


if __name__ == "__main__":
    app.run(debug=True)