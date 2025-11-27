# 🎓 Student Conduct System

ระบบบริหารจัดการคะแนนความประพฤตินักเรียน (Student Conduct Management System) - เว็บแอปพลิเคชันสำหรับโรงเรียนในการติดตามและจัดการคะแนนความประพฤติของนักเรียน

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Mobile Ready](https://img.shields.io/badge/Mobile-Ready-green)](https://github.com)

## ✨ Features

### 👥 User Roles
- **👨‍💼 Admin** - จัดการผู้ใช้งานทั้งหมด
- **👨‍🏫 Teacher** - บันทึก แก้ไข ลบการกระทำผิด และพิจารณาอุทธรณ์
- **👨‍🎓 Student** - ดูคะแนนและยื่นอุทธรณ์

### 📊 Main Features
- ✅ **Student Management** - เพิ่ม แก้ไข ลบ นำเข้า/ส่งออกข้อมูลนักเรียน
- ✅ **Violation Tracking** - บันทึก แก้ไข ลบการกระทำผิดพร้อมหักคะแนนอัตโนมัติ
- ✅ **Appeal System** - ระบบยื่นอุทธรณ์และพิจารณาคืนคะแนน
- ✅ **Reports & Analytics** - รายงานสถิติและกราฟแสดงข้อมูล
- ✅ **Excel Import** - นำเข้าข้อมูลนักเรียนจากไฟล์ Excel
- ✅ **Dark Mode** - รองรับโหมดมืด
- ✅ **Mobile Responsive** - ใช้งานได้บนทุกอุปกรณ์

### 📱 Mobile Optimizations
- Horizontal scrollable navigation
- Full-screen modals on small screens
- No auto-zoom on input fields (16px font size)
- Touch-friendly buttons (44x44px minimum)
- Smooth scrolling and custom scrollbar
- Optimized for iOS and Android

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/student-conduct-system.git
cd student-conduct-system
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
student-conduct-system/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── students/       # Student CRUD operations
│   │   └── violations/     # Violation CRUD operations
│   ├── globals.css         # Global styles (mobile-optimized)
│   └── page.tsx            # Main page
├── components/
│   ├── auth/               # Login & Register screens
│   ├── layout/             # Header component
│   ├── modals/             # Modal components
│   │   ├── AddStudentModal.tsx
│   │   ├── EditStudentModal.tsx
│   │   ├── AddViolationModal.tsx
│   │   ├── EditViolationModal.tsx
│   │   └── Modal.tsx       # Base modal (mobile-responsive)
│   ├── tabs/               # Tab components
│   │   ├── Dashboard.tsx
│   │   ├── StudentsTab.tsx
│   │   ├── ViolationsTab.tsx
│   │   ├── ReportsTab.tsx
│   │   ├── MyScoreTab.tsx
│   │   └── MyAppealsTab.tsx
│   ├── ui/                 # UI components
│   │   ├── Input.tsx       # Mobile-optimized input
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── TabButton.tsx   # Responsive tab button
│   │   └── ...
│   └── StudentConductUI.tsx # Main UI component
├── data/                    # JSON data files
│   ├── students.json
│   ├── violations.json
│   └── users.json
├── types/                   # TypeScript type definitions
└── utils/                   # Utility functions
```

## 🎮 Usage

### Default Users

#### Admin Account
- Username: `admin`
- Password: `admin123`

#### Teacher Account
- Username: `teacher1`
- Password: `teacher123`

#### Student Account
- Student ID: `66010001`
- Password: `student123`

### Key Features Guide

#### For Teachers/Admins:

1. **Add Violation**
   - Go to Violations tab
   - Click "บันทึกการกระทำผิด"
   - Select violation type from dropdown
   - Enter details and points to deduct
   - Submit

2. **Edit Violation**
   - Click blue Edit button on any violation
   - Modify details as needed
   - Points will auto-adjust on student's score

3. **Delete Violation**
   - Click red Delete button
   - Confirm deletion
   - Points will be automatically restored to student

4. **Review Appeals**
   - View pending appeals in Violations tab
   - Approve or reject with comments
   - Restored points are added automatically

#### For Students:

1. **View Score**
   - Login with Student ID
   - View conduct score and history

2. **Submit Appeal**
   - Go to My Appeals tab
   - Select violation to appeal
   - Write message and upload evidence (optional)
   - Submit for teacher review

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Excel**: SheetJS (xlsx)
- **Data Storage**: JSON files (for demo purposes)

## 📱 Mobile Support

This application is fully optimized for mobile devices:

- ✅ Responsive navigation with horizontal scrolling
- ✅ Touch-friendly interface (44x44px minimum tap targets)
- ✅ Prevents input zoom on iOS (16px font size)
- ✅ Full-screen modals on small screens
- ✅ Optimized spacing and typography for mobile
- ✅ Works offline (PWA-ready architecture)

## 🔒 Security Note

⚠️ **This is a demonstration project**. For production use:
- Implement proper password hashing (bcrypt, argon2)
- Use a real database (PostgreSQL, MongoDB)
- Add JWT or session-based authentication
- Implement CSRF protection
- Use environment variables for sensitive data
- Add rate limiting and input validation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created with ❤️ by [Your Name]

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for beautiful icons
- All contributors and users of this system

---

**Note**: This system uses JSON files for data storage for demonstration purposes. For production use, please integrate with a proper database system.
