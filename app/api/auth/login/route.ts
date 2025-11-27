import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { UserAccount } from '@/types';

const dataFilePath = path.join(process.cwd(), 'data/users.json');

async function readUsers(): Promise<UserAccount[]> {
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

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
  }

  const users = await readUsers();

  // IMPORTANT: In a real application, passwords should be hashed and compared securely.
  // This is a simplified example and is not secure.
  // Check if the input matches username OR studentId
  const user = users.find(u => (u.username === username || u.studentId === username) && u.password === password);

  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  // Do not send the password back to the client
  const { password: _, ...userWithoutPassword } = user;

  return NextResponse.json(userWithoutPassword);
}
