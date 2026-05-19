import cv2
import mediapipe as mp
import numpy as np
import pickle

# LOAD MODEL
model = pickle.load(open("hand_model.pkl", "rb"))

# CAMERA
cap = cv2.VideoCapture(0)

# MEDIAPIPE
mp_hands = mp.solutions.hands

hands = mp_hands.Hands(
    max_num_hands=1,
    min_detection_confidence=0.7
)

while True:
    success, frame = cap.read()

    if not success:
        break

    frame = cv2.flip(frame, 1)

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = hands.process(rgb)

    h, w, _ = frame.shape

    if results.multi_hand_landmarks:

        for handLms in results.multi_hand_landmarks:

            # TEMPLATE
            template = []

            base_x = handLms.landmark[0].x
            base_y = handLms.landmark[0].y

            for idx in [4, 8, 12, 16, 20]:

                lm = handLms.landmark[idx]

                template.append(lm.x - base_x)
                template.append(lm.y - base_y)

            # PREDICTION
            prediction = model.predict([template])

            # SHOW RESULT
            cv2.putText(
                frame,
                f"User: {prediction[0]}",
                (20, 60),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )

    cv2.imshow("EdgePrint AI Authentication", frame)

    if cv2.waitKey(1) == 27:
        break

cap.release()
cv2.destroyAllWindows()