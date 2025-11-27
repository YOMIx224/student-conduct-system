import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Violation, Student } from '@/types';

const violationsFilePath = path.join(process.cwd(), 'data/violations.json');
const studentsFilePath = path.join(process.cwd(), 'data/students.json');

async function readViolations(): Promise<Violation[]> {
  const fileContent = await fs.readFile(violationsFilePath, 'utf-8');
  return JSON.parse(fileContent);
}

async function writeViolations(data: Violation[]): Promise<void> {
  await fs.writeFile(violationsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function readStudents(): Promise<Student[]> {
  const fileContent = await fs.readFile(studentsFilePath, 'utf-8');
  return JSON.parse(fileContent);
}

async function writeStudents(data: Student[]): Promise<void> {
  await fs.writeFile(studentsFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const violations = await readViolations();
  const violationIndex = violations.findIndex(v => v.id === id);

  if (violationIndex === -1) {
    return NextResponse.json({ message: 'Violation not found' }, { status: 404 });
  }

  const violation = violations[violationIndex];

  // Case 1: Submitting a new appeal
  if (body.message) {
    const { message, image, byStudentId } = body;
    const newAppeal = {
      id: `appeal_${Date.now()}`,
      byStudentId,
      message,
      image,
      submittedAt: new Date().toISOString(),
      status: 'pending' as const,
    };
    if (!violation.appeals) {
      violation.appeals = [];
    }
    violation.appeals.push(newAppeal);
  }
  // Case 2: Reviewing an existing appeal
  else if (body.appealId && body.status) {
    const { appealId, status, teacherResponse, restoredPoints } = body;
    const appealIndex = violation.appeals?.findIndex(a => a.id === appealId);

    if (appealIndex === undefined || appealIndex === -1) {
      return NextResponse.json({ message: 'Appeal not found' }, { status: 404 });
    }

    violation.appeals![appealIndex].status = status;
    violation.appeals![appealIndex].teacherResponse = teacherResponse;
    violation.appeals![appealIndex].respondedAt = new Date().toISOString();

    if (status === 'approved' && typeof restoredPoints === 'number' && restoredPoints > 0) {
      violation.appeals![appealIndex].restoredPoints = restoredPoints;

      const students = await readStudents();
      const studentIndex = students.findIndex(s => s.studentId === violation.studentId);
      if (studentIndex !== -1) {
        students[studentIndex].conductScore = Math.min(100, students[studentIndex].conductScore + restoredPoints);
        await writeStudents(students);
      }
    }
  } else {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  await writeViolations(violations);

  return NextResponse.json(violation);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const violations = await readViolations();
  const violationIndex = violations.findIndex(v => v.id === id);

  if (violationIndex === -1) {
    return NextResponse.json({ message: 'Violation not found' }, { status: 404 });
  }

  // Update violation fields
  const updatedViolation = {
    ...violations[violationIndex],
    ...body,
    id, // Preserve ID
    studentId: violations[violationIndex].studentId, // Preserve student ID
    studentName: violations[violationIndex].studentName, // Preserve student name
  };

  violations[violationIndex] = updatedViolation;
  await writeViolations(violations);

  return NextResponse.json(updatedViolation);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const violations = await readViolations();
  const violationIndex = violations.findIndex(v => v.id === id);

  if (violationIndex === -1) {
    return NextResponse.json({ message: 'Violation not found' }, { status: 404 });
  }

  const violation = violations[violationIndex];

  // Restore points to the student
  const students = await readStudents();
  const studentIndex = students.findIndex(s => s.studentId === violation.studentId);
  if (studentIndex !== -1) {
    students[studentIndex].conductScore = Math.min(100, students[studentIndex].conductScore + violation.pointsDeducted);
    await writeStudents(students);
  }

  // Remove the violation
  violations.splice(violationIndex, 1);
  await writeViolations(violations);

  return NextResponse.json({ message: 'Violation deleted successfully' });
}
