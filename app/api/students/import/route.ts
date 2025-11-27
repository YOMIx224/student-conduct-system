import { NextRequest, NextResponse } from 'next/server';
import * as xlsx from 'xlsx';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    const studentsFilePath = path.join(process.cwd(), 'data', 'students.json');
    
    // For simplicity, we are overwriting the file. 
    // In a real-world scenario, you might want to merge data.
    await fs.writeFile(studentsFilePath, JSON.stringify(jsonData, null, 2));

    return NextResponse.json({ message: 'Students imported successfully' });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to import students' }, { status: 500 });
  }
}
