import { NextRequest, NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import fs from 'fs/promises';
import path from 'path';

interface ImportedStudent {
  studentId: string;
  name: string;
  class: string;
  department: string;
  phone?: string;
  email?: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file extension
    const filename = file.name.toLowerCase();
    if (!filename.endsWith('.xlsx') && !filename.endsWith('.xls') && !filename.endsWith('.csv')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload Excel or CSV file.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse Excel/CSV file
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = xlsx.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    // Validate and transform data
    const students: any[] = [];
    const errors: string[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNum = i + 2; // Excel row number (header is row 1)

      // Required fields validation
      if (!row.studentId || !row.name || !row.class || !row.department) {
        errors.push(`Row ${rowNum}: Missing required fields (studentId, name, class, department)`);
        continue;
      }

      students.push({
        id: `s${Date.now()}_${i}`,
        studentId: String(row.studentId).trim(),
        name: String(row.name).trim(),
        class: String(row.class).trim(),
        department: String(row.department).trim(),
        phone: row.phone ? String(row.phone).trim() : '',
        email: row.email ? String(row.email).trim() : '',
        conductScore: 100 // Default score
      });
    }

    if (students.length === 0) {
      return NextResponse.json({
        error: 'No valid students found',
        details: errors
      }, { status: 400 });
    }

    // Read existing students
    const studentsFilePath = path.join(process.cwd(), 'data', 'students.json');
    let existingStudents: any[] = [];

    try {
      const fileContent = await fs.readFile(studentsFilePath, 'utf-8');
      existingStudents = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is empty, start fresh
      existingStudents = [];
    }

    // Check for duplicates
    const existingIds = new Set(existingStudents.map(s => s.studentId));
    const duplicates: string[] = [];
    const newStudents: any[] = [];

    for (const student of students) {
      if (existingIds.has(student.studentId)) {
        duplicates.push(student.studentId);
      } else {
        newStudents.push(student);
        existingIds.add(student.studentId);
      }
    }

    // Merge with existing students
    const allStudents = [...existingStudents, ...newStudents];

    // Save to file
    await fs.writeFile(studentsFilePath, JSON.stringify(allStudents, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Students imported successfully',
      imported: newStudents.length,
      duplicates: duplicates.length,
      duplicateIds: duplicates,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({
      error: 'Failed to import students',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
