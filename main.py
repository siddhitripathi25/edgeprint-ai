import cv2
import mediapipe as mp
import numpy as np
import csv


cap = cv2.VideoCapture(0)

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    max_num_hands=1,
    min_detection_confidence=0.7
)

mp_draw = mp.solutions.drawing_utils
prev_gray = None
motion_score = 0
save_data = False
while True:
    success, frame = cap.read()
    if not success:
        break

    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(rgb)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    if prev_gray is not None:
        diff = cv2.absdiff(gray, prev_gray)
        motion_score = np.mean(diff)

    prev_gray = gray

    cv2.putText(frame, f"Motion: {int(motion_score)}",
                (20, 120),
                cv2.FONT_HERSHEY_SIMPLEX,
                1, (255, 255, 0), 2)

    if motion_score < 2:
        cv2.putText(frame, "SUSPICIOUS (NO MOTION)",
                    (20, 160),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1, (0, 0, 255), 2)
    blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()

    cv2.putText(frame, f"Quality: {int(blur_score)}",
                (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX,
                1, (0, 255, 0), 2)

    if blur_score < 100:
        cv2.putText(frame, "BAD QUALITY",
                    (20, 80),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    1, (0, 0, 255), 2)

    if results.multi_hand_landmarks:
        for handLms in results.multi_hand_landmarks:
            # =========================
            # TEMPLATE GENERATION
            # =========================

            template = []

            base_x = handLms.landmark[0].x
            base_y = handLms.landmark[0].y

            for idx in [4, 8, 12, 16, 20]:
                lm = handLms.landmark[idx]

                template.append(lm.x - base_x)
                template.append(lm.y - base_y)

            label = "user1"

            row = template + [label]
            if save_data:
                with open("dataset.csv", "a", newline="") as f:
                    writer = csv.writer(f)
                    writer.writerow(row)
                print("Template Saved!")
                save_data = False

            cv2.putText(frame, "Template Generated",
                        (20, 200),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        1, (0, 255, 255), 2)

            fingers = {
                "thumb": 4,
                "index": 8,
                "middle": 12,
                "ring": 16,
                "pinky": 20
            }

            selected_fingers = ["index", "middle", "ring", "pinky"]

            for name, idx in fingers.items():
                if name in selected_fingers:

                    x = int(handLms.landmark[idx].x * w)
                    y = int(handLms.landmark[idx].y * h)

                    cv2.circle(frame, (x, y), 10, (0, 0, 255), -1)
                    cv2.putText(frame, name, (x+10, y),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255,255,255), 1)

                    if name == "index":
                        box = 60

                        x1 = max(0, x - box)
                        y1 = max(0, y - box)
                        x2 = min(w, x + box)
                        y2 = min(h, y + box)

                        cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                        # cv2.imshow("Finger ROI", finger_roi)
    cv2.imshow("EdgePrint AI - Hand Tracking", frame)

    if cv2.waitKey(1) == 27:
        break

    key = cv2.waitKey(1)

    if key == ord('s'):
        save_data = True
        print("Saving template...")

    if key == 27:
        break
cap.release()
cv2.destroyAllWindows()