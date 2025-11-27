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

async function writeUsers(data: UserAccount[]): Promise<void> {
  // IMPORTANT: In a real application, you should hash the password before saving.
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function POST(request: Request) {
  const newUser: UserAccount = await request.json();

  if (!newUser.username || !newUser.password || !newUser.role || !newUser.name || !newUser.email) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const users = await readUsers();

  if (users.some(u => u.username === newUser.username)) {
    return NextResponse.json({ message: 'Username already exists' }, { status: 409 });
  }

  users.push(newUser);
  await writeUsers(users);

  const { password, ...userWithoutPassword } = newUser;

  return NextResponse.json(userWithoutPassword, { status: 201 });
}
