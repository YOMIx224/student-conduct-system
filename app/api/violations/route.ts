import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Violation } from '@/types';

const dataFilePath = path.join(process.cwd(), 'data/violations.json');

async function readData(): Promise<Violation[]> {
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

async function writeData(data: Violation[]): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  const violations = await readData();
  return NextResponse.json(violations);
}

export async function POST(request: Request) {
  const violations = await readData();
  const newViolation: Omit<Violation, 'id'> = await request.json();

  // Check for duplicate violation on the same day
  const isDuplicate = violations.some(v =>
    v.studentId === newViolation.studentId &&
    v.violationType === newViolation.violationType &&
    v.date === newViolation.date
  );

  if (isDuplicate) {
    return NextResponse.json(
      { message: 'นักเรียนคนนี้ถูกหักคะแนนในเรื่องนี้ไปแล้วในวันนี้' },
      { status: 400 }
    );
  }

  const violationWithId: Violation = {
    id: Date.now().toString(),
    ...newViolation,
  };

  violations.push(violationWithId);
  await writeData(violations);

  return NextResponse.json(violationWithId, { status: 201 });
}
