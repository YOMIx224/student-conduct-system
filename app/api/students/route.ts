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
    // If the file doesn't exist, return an empty array
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeData(data: Student[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  const students = await readData();
  return NextResponse.json(students);
}

export async function POST(request: Request) {
  const students = await readData();
  const newStudentData: Omit<Student, 'id' | 'conductScore'> = await request.json();

  const studentWithId: Student = {
    id: Date.now().toString(),
    conductScore: 100,
    ...newStudentData,
  };

  students.push(studentWithId);
  await writeData(students);

  return NextResponse.json(studentWithId, { status: 201 });
}
