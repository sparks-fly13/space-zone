import re
from flask import Flask, request, jsonify
from tensorflow import keras
import os
import cv2

app = Flask(__name__)
model = keras.models.load_model('space_classification_model.h5')
categories = ['stars', 'galaxies', 'planets', 'cosmos', 'constellation', 'nebula']

positive_words = [
    "great", "love", "helpful", "excellent", "like", "good", "cool", "wow", "amazing",
    "fantastic", "awesome", "wonderful", "terrific", "superb", "impressive", "outstanding",
    "pleased", "satisfied", "happy", "delighted", "brilliant", "super", "fabulous", "nice",
    "remarkable", "perfect", "fine", "phenomenal", "splendid", "exquisite", "marvelous",
    "exceptional", "top-notch", "stellar", "admirable", "incredible", "greatest", "thrilled",
    "enjoyable", "lovely", "exhilarating", "delicious", "fun", "grateful", "refreshing",
    "thx", "gr8", "luv", "thnx", "hppy", "awsm"
]

negative_words = [
    "terrible", "frustrated", "not sure", "confusing", "bad", "not nice", "didn't", "not", "did not",
    "awful", "horrible", "disappointed", "unpleasant", "dreadful", "inferior", "poor", "unfortunate",
    "annoying", "frustrating", "displeased", "miserable", "upset", "disgusting", "lousy", "unhappy",
    "dislike", "repulsive", "unsatisfactory", "unimpressed", "hated", "regret", "irritating",
    "distasteful", "disheartening", "unsuitable", "unfavorable", "gross", "depressing", "troubled",
    "appalling", "discomforting", "deficient", "detestable", "unwanted", "unfortunate", "unbearable",
    "tho", "sux", "ugh", "smh", "meh", "grr"
]



def categorize_feedback(feedback):
    """Categorizes feedback as negative or positive."""
    feedback = feedback.lower()
    if any(word in feedback for word in positive_words):
        return "positive"
    elif any(word in feedback for word in negative_words):
        return "negative"
    else:
        return "neutral"

def reply_to_feedback(category):
    """Replies to feedback with a thank you or an apology."""
    if category == "positive":
        return "Thank you for your feedback!"
    else:
        return "We're sorry to hear that you're having trouble. Please let us know how we can help."

@app.route("/feedback", methods=["POST"])
def feedback():
    feedback = request.form.get("feedback") or request.json.get("feedback")
    if feedback is None:
        return jsonify({"error": "Invalid request"}), 400
    category = categorize_feedback(feedback)
    reply = reply_to_feedback(category)
    return jsonify({"category": category, "reply": reply})
# @app.route("/feedback", methods=["POST"])
# def feedback():
#     feedback = request.json["feedback"]
#     category = categorize_feedback(feedback)
#     reply = reply_to_feedback(category)
#     return {"category": category, "reply": reply}

@app.route('/predict', methods=['POST'])
def predict():
    image_path = request.json.get('file')
    if image_path:
        image = cv2.imread(image_path)
        image = cv2.resize(image, (224, 224))
        image = image / 255.0
        image = image.reshape(1, 224, 224, 3)
        predictions = model.predict(image)
        category_index = predictions.argmax()
        category = categories[category_index]
        return jsonify({"prediction": category, "selected_file": image_path})
    else:
        return jsonify({"error": "Invalid request"}), 400

if __name__ == "__main__":
    app.run(debug=True)
