# CBT SMKS Putra Anda Binjai - Online Exam System v1.0.0

## 🎓 Features

✅ **Student Features:**
- Take online exams with real-time timer (1 hour per exam)
- Multiple question types:
  - Multiple Choice (Pilihan Ganda)
  - Essay (Uraian)
  - True/False (Benar/Salah)
  - Matching Test (Pencocokan)
- Auto-submit when time runs out
- Manual submit before time ends
- View score and results immediately
- Review answers after exam
- Secure exam environment

✅ **Admin/Teacher Features:**
- Create and manage exams
- Custom question creation with multiple types
- Question bank management
- Set passing score
- Monitor student progress
- View detailed results and analytics
- Export reports
- Manage students and classes

✅ **System Features:**
- Real-time countdown timer
- Secure exam session (prevent tab switching)
- Auto-submit on timeout
- Randomize question order (optional)
- Question shuffling
- Instant grading
- Student dashboard
- Admin dashboard
- Responsive design (mobile-friendly)
- User authentication

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 + React 18 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js
- **Validation:** Zod
- **Deployment:** Vercel-ready

## 📋 Question Types

### 1. Multiple Choice (Pilihan Ganda)
- Question text
- Option A, B, C, D, E
- One correct answer
- Point value

### 2. Essay (Uraian)
- Question text
- Free text answer
- Manual grading by teacher
- Point value

### 3. True/False (Benar/Salah)
- Statement
- True or False answer
- Point value

### 4. Matching Test (Pencocokan)
- Left column items
- Right column items to match
- Multiple matching pairs
- Point value

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/cicinakal/cbt-smks-putra-anda-binjai.git
cd cbt-smks-putra-anda-binjai

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Setup database
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Visit http://localhost:3000

## 📊 Database Schema

- **User** - Students, Teachers, Admin
- **Exam** - Exam details (name, subject, duration, passing score)
- **Question** - Questions with type, content, options
- **StudentExam** - Student exam session (start time, end time, status)
- **StudentAnswer** - Student answers to questions
- **ExamResult** - Final score and grade

## 🔐 Security

- Password hashing with bcrypt
- JWT authentication
- Session management
- Exam session locking
- Secure time tracking
- Input validation

## 📱 User Roles

1. **Student (Siswa)**
   - View available exams
   - Take exams
   - View results

2. **Teacher (Guru)**
   - Create exams
   - Create questions
   - Grade essays
   - View student progress

3. **Admin (Administrator)**
   - Full system management
   - User management
   - Exam management
   - Reports and analytics

## 🎯 Exam Flow

1. **Exam Setup:** Admin/Teacher creates exam and questions
2. **Student Registration:** Students register for exam
3. **Exam Start:** Student clicks "Start Exam"
4. **Timer Active:** 1 hour countdown starts
5. **Answer Questions:** Student answers all question types
6. **Submit:** Student clicks submit OR timer auto-submits
7. **Results:** Student sees score immediately
8. **Review:** Student can review answers
9. **Teacher Review:** Teacher grades essay questions

## 📈 Grading

- **Multiple Choice:** Auto-graded (correct/incorrect)
- **True/False:** Auto-graded (correct/incorrect)
- **Matching:** Auto-graded (correct/incorrect)
- **Essay:** Manual grading by teacher
- **Final Score:** Calculated automatically
- **Grade:** Converted based on passing score

## 🌐 Deployment

Deploy to Vercel with one click:
1. Go to https://vercel.com
2. Import this repository
3. Add environment variables
4. Deploy!

## 📞 Support

For issues or questions, open an issue on GitHub.

## 📄 License

MIT License

---

**Version:** 1.0.0
**Last Updated:** September 2026
**School:** SMKS Putra Anda Binjai
