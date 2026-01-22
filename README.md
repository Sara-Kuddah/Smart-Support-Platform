# Smart Support Platform | منصة الدعم الذكي

A professional, modern Arabic landing page and management system designed for charitable and nonprofit organizations to submit project funding proposals.

## 🌟 Features | المميزات
- **Smart Submission Form**: Comprehensive form for nonprofit entities.
- **AI-Powered Review**: Real-time project evaluation using **Google Gemini AI** to provide feedback and suggestions for improvement.
- **Admin Dashboard**: Secure management portal to review, approve, or reject proposals.
- **Real-time Sync**: Instant updates using **Supabase** database and real-time subscriptions.
- **Fully Responsive**: Optimized for desktops, tablets, and smartphones.

## 🛠️ Tech Stack | التقنيات المستخدمة
- **Frontend**: React (v19), TypeScript, Tailwind CSS.
- **Icons**: Lucide React.
- **Backend/DB**: Supabase (PostgreSQL).
- **Intelligence**: Google Gemini API (@google/genai).

## 🚀 Setup | التشغيل
1. Clone the repository:
   ```bash
   git clone https://github.com/Sara-Kuddah/Smart-Support-Platform.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file with your `API_KEY` for Google GenAI.
4. Run the development server:
   ```bash
   npm start
   ```

## 📂 Database Setup | إعداد قاعدة البيانات
Use the provided `database.sql` file to set up your Supabase table and Row Level Security (RLS) policies.

---
© 2024 Smart Support Platform. All rights reserved.