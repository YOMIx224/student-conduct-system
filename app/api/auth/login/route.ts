import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { UserAccount, Student } from '@/types';

const usersFilePath = path.join(process.cwd(), 'data/users.json');
const studentsFilePath = path.join(process.cwd(), 'data/students.json');

async function readData<T>(filePath: string): Promise<T[]> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
  }

  const users = await readData<UserAccount>(usersFilePath);
  const students = await readData<Student>(studentsFilePath);

  // Check for admin/teacher user
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  }

  // Check for student user
  const student = students.find(s => s.studentId === username);

  if (student) {
    // For students, the user requested to login with studentId.
    // We will use a generic password 'student123' as mentioned in the test data.
    if (password === 'student123') {
      const studentUser: UserAccount = {
        id: student.id,
        username: student.studentId,
        role: 'student',
        name: student.name,
        email: student.email,
        studentId: student.studentId,
      };
      return NextResponse.json(studentUser);
    }
  }

  return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}

