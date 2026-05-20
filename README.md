EdgePrint AI ✋🧠
Real-Time Hand Biometrics & Anti-Spoof Authentication System

EdgePrint AI is a real-time AI-powered biometric authentication system that verifies live human hands using computer vision, motion analysis, liveness detection, and machine learning.

Built with a full-stack architecture using FastAPI, MediaPipe, OpenCV, Scikit-learn, and Next.js, the system detects spoof attacks such as static images, fake hand displays, low-quality frames, and no-motion attempts.

🚀 Features
• ✋ Real-time hand landmark detection using MediaPipe
• 🧠 Machine Learning-based hand identity recognition
• 🛡️ Anti-spoof / liveness detection
• 📈 Motion analysis system
• 🎯 Finger movement tracking
• 📷 Blur & image quality detection
• 🔥 Live verification scoring
• 📊 ML-style interactive dashboard
• 🌐 Full-stack deployment
• ⚡ FastAPI backend APIs
• 🎥 Live webcam feed processing
• ☁️ Cloud deployment with Render & Vercel

🧠 Anti-Spoof Detection Techniques

EdgePrint AI verifies whether the detected hand belongs to a real live user using multiple security layers:

✅ Motion Detection
Detects frame-to-frame movement to identify static spoof attempts.

✅ Blur Detection
Uses Laplacian variance to reject blurry or low-quality inputs.

✅ Finger Movement Tracking
Tracks live index finger movement for dynamic liveness verification.

✅ Continuous Frame Validation
Validates multiple consecutive frames before authentication.

✅ Landmark-Based Biometric Signature
Generates unique hand geometry templates using MediaPipe landmarks.

🏗️ Tech Stack
Frontend
• Next.js
• TypeScript
• Tailwind CSS
• Framer Motion
• Recharts
Backend
• FastAPI
• OpenCV
• MediaPipe
• NumPy
• Scikit-learn
• Pandas
• Uvicorn
Deployment
• Vercel (Frontend)
• Render (Backend)

📂 Project Structure

edgeprint-ai/
│
├── frontend/              # Next.js dashboard
│
├── backend/
│   ├── app.py             # FastAPI backend
│   ├── train.py           # ML training script
│   ├── predict.py         # Prediction script
│   ├── dataset.csv        # Hand landmark dataset
│   ├── hand_model.pkl     # Trained ML model
│   └── requirements.txt
│
└── README.md

⚙️ Installation

1️⃣ Clone Repository
git clone https://github.com/YOUR_USERNAME/edgeprint-ai.git
cd edgeprint-ai

🖥️ Backend Setup
Create Virtual Environment
python -m venv venv

Activate Environment
Mac/Linux
source venv/bin/activate

Windows
venv\Scripts\activate

Install Dependencies
pip install -r requirements.txt

Start Backend
uvicorn app:app --reload

🌐 Frontend Setup
cd frontend
npm install
npm run dev

🧪 ML Workflow
Step 1 — Capture Hand Landmarks
MediaPipe extracts fingertip coordinates.

Step 2 — Generate Template
Relative landmark positions are stored.

Step 3 — Save Dataset
Templates are stored inside dataset.csv.

Step 4 — Train Model
Scikit-learn model learns biometric patterns.

Step 5 — Real-Time Prediction
Incoming templates are classified live.

🔒 Liveness Verification Logic

Authentication succeeds only if:
- Image quality is high
- Motion is detected
- Finger movement exists
- Multiple valid frames are verified

Otherwise:
FAKE / SPOOF DETECTED

🎯 Future Improvements
• Multi-user authentication
• TensorFlow/PyTorch deep learning models
• Face + hand multimodal verification
• WebRTC real-time streaming
• Mobile support
• Database integration
• JWT authentication
• Admin analytics panel
• Edge AI optimization
