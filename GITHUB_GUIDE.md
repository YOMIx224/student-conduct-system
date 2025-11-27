# 📋 วิธีการอัปโหลดโปรเจกต์ขึ้น GitHub

## ขั้นตอนที่ 1: ติดตั้ง Git (ถ้ายังไม่ได้ติดตั้ง)

1. ดาวน์โหลด Git จาก: https://git-scm.com/download/win
2. ติดตั้งตามขั้นตอน (ใช้ค่า default ได้เลย)
3. เปิด Git Bash หรือ Command Prompt ใหม่

## ขั้นตอนที่ 2: สร้าง Repository บน GitHub

1. ไปที่ https://github.com
2. คลิก **"New repository"** (ปุ่มสีเขียว)
3. ตั้งชื่อ repository: `student-conduct-system`
4. เลือก Public หรือ Private ตามต้องการ
5. **อย่า**เลือก "Initialize this repository with a README"
6. คลิก **"Create repository"**

## ขั้นตอนที่ 3: Push โปรเจกต์ขึ้น GitHub

เปิด **Git Bash** หรือ **Command Prompt** แล้วรันคำสั่งเหล่านี้:

### 3.1 ตั้งค่า git config (ครั้งแรกเท่านั้น)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3.2 สร้าง git repository
```bash
cd C:\Users\User\student-conduct-system
git init
```

### 3.3 เพิ่มไฟล์ทั้งหมด
```bash
git add .
```

### 3.4 Commit การเปลี่ยนแปลง
```bash
git commit -m "Initial commit: Student Conduct System with mobile responsiveness"
```

### 3.5 เชื่อมต่อกับ GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/student-conduct-system.git
```
**⚠️ แทนที่ `YOUR_USERNAME` ด้วยชื่อผู้ใช้ GitHub ของคุณ**

### 3.6 Push ขึ้น GitHub
```bash
git branch -M main
git push -u origin main
```

## ขั้นตอนที่ 4: ยืนยันว่าอัปโหลดสำเร็จ

1. ไปที่ https://github.com/YOUR_USERNAME/student-conduct-system
2. ตรวจสอบว่าไฟล์ทั้งหมดแสดงอยู่
3. README.md จะแสดงอัตโนมัติที่หน้าแรก

---

## 🎯 คำสั่ง Git ที่ใช้บ่อย (สำหรับอัปเดตในอนาคต)

### เพิ่มการเปลี่ยนแปลงใหม่
```bash
git add .
git commit -m "คำอธิบายการเปลี่ยนแปลง"
git push
```

### ดึงการเปลี่ยนแปลงจาก GitHub
```bash
git pull
```

### ตรวจสอบสถานะ
```bash
git status
```

### ดูประวัติการ commit
```bash
git log
```

---

## 🔐 Authentication Options

### Option 1: HTTPS (แนะนำ)
- ใช้ Personal Access Token (PAT) แทนรหัสผ่าน
- สร้าง PAT ที่: https://github.com/settings/tokens
- เลือก scopes: `repo`
- ใช้ PAT แทนรหัสผ่านเมื่อ push

### Option 2: SSH
```bash
# สร้าง SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# คัดลอก public key
cat ~/.ssh/id_ed25519.pub

# เพิ่มที่ GitHub: Settings → SSH and GPG keys → New SSH key
```

แล้วใช้ SSH URL แทน HTTPS:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/student-conduct-system.git
```

---

## ❓ Troubleshooting

### ปัญหา 1: "git: command not found"
**วิธีแก้**: ติดตั้ง Git จาก https://git-scm.com/download/win

### ปัญหา 2: "Permission denied"
**วิธีแก้**: ตรวจสอบ username/password หรือใช้ Personal Access Token

### ปัญหา 3: "remote origin already exists"
**วิธีแก้**: 
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/student-conduct-system.git
```

### ปัญหา 4: ไฟล์ใหญ่เกินไป
**วิธีแก้**: ตรวจสอบว่า `.gitignore` มี `node_modules/` และ `.next/` แล้ว

---

## 📸 Screenshots

หลังจากอัปโหลดเสร็จ คุณสามารถเพิ่ม screenshots ของโปรเจกต์:

1. สร้างโฟลเดอร์ `screenshots` ในโปรเจกต์
2. ใส่รูปภาพ
3. อัปเดต README.md:
```markdown
## Screenshots

![Dashboard](screenshots/dashboard.png)
![Mobile View](screenshots/mobile.png)
```

---

## 🎉 เสร็จสิ้น!

โปรเจกต์ของคุณพร้อมแชร์แล้ว! 🚀

URL: `https://github.com/YOUR_USERNAME/student-conduct-system`
