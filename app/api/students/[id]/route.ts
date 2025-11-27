import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Student } from '@/types';

const dataFilePath = path.join(process.cwd(), 'data/students.json');

async function readData(): Promise<Student[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeData(data: Student[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { studentId, name, class: studentClass, department, phone, email } = body;

  if (!studentId || !name) {
    return NextResponse.json({ message: 'Student ID and name are required' }, { status: 400 });
  }

  const students = await readData();
  const studentIndex = students.findIndex(s => s.id === id);

  if (studentIndex === -1) {
    return NextResponse.json({ message: 'Student not found' }, { status: 404 });
  }

  // Update student data while preserving id and conductScore
  students[studentIndex] = {
    ...students[studentIndex],
    studentId,
    name,
    class: studentClass,
    department,
    phone,
    email,
  };

  await writeData(students);

  return NextResponse.json(students[studentIndex]);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { conductScore } = body;

  if (typeof conductScore !== 'number') {
    return NextResponse.json({ message: 'Invalid conduct score' }, { status: 400 });
  }

  const students = await readData();
  const studentIndex = students.findIndex(s => s.id === id);

  if (studentIndex === -1) {
    return NextResponse.json({ message: 'Student not found' }, { status: 404 });
  }

  students[studentIndex].conductScore = conductScore;
  await writeData(students);

  return NextResponse.json(students[studentIndex]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const students = await readData();
  const updatedStudents = students.filter(s => s.id !== id);

  if (students.length === updatedStudents.length) {
    return NextResponse.json({ message: 'Student not found' }, { status: 404 });
  }

  await writeData(updatedStudents);

  return NextResponse.json({ message: 'Student deleted' }, { status: 200 });
}

