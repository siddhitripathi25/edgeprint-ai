EdgePrint AI ✋🧠
Real-Time Hand Biometrics & Anti-Spoof Authentication System

EdgePrint AI is a real-time AI-powered biometric authentication system that verifies live human hands using computer vision, motion analysis, liveness detection, and machine learning.

Built with a full-stack architecture using FastAPI, MediaPipe, OpenCV, Scikit-learn, and Next.js, the system detects spoof attacks such as static images, fake hand displays, low-quality frames, and no-motion attempts.

🚀 Features
✋ Real-time hand landmark detection using MediaPipe
🧠 Machine Learning-based hand identity recognition
🛡️ Anti-spoof / liveness detection
📈 Motion analysis system
🎯 Finger movement tracking
📷 Blur & image quality detection
🔥 Live verification scoring
📊 ML-style interactive dashboard
🌐 Full-stack deployment
⚡ FastAPI backend APIs
🎥 Live webcam feed processing
☁️ Cloud deployment with Render & Vercel

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
󠁯•󠁏 Next.js
󠁯•󠁏 TypeScript
󠁯•󠁏 Tailwind CSS
󠁯•󠁏 Framer Motion
󠁯•󠁏 Recharts
Backend
󠁯•󠁏 FastAPI
󠁯•󠁏 OpenCV
󠁯•󠁏 MediaPipe
󠁯•󠁏 NumPy
󠁯•󠁏 Scikit-learn
󠁯•󠁏 Pandas
󠁯•󠁏 Uvicorn
Deployment
󠁯•󠁏 Vercel (Frontend)
󠁯•󠁏 Render (Backend)
