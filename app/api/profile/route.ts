import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function PATCH(request: NextRequest) {
    try {
        const updates = await request.json();
        const { username, ...profileUpdates } = updates;

        // Read current users
        const usersData = await fs.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(usersData);

        // Find and update the user
        const userIndex = users.findIndex((u: any) => u.username === username);

        if (userIndex === -1) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Update user profile (excluding password for security)
        users[userIndex] = {
            ...users[userIndex],
            ...profileUpdates,
            username: users[userIndex].username, // Keep original username
            password: users[userIndex].password, // Keep original password
            role: users[userIndex].role, // Keep original role
        };

        // Write updated users back to file
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

        // Return updated user (without password)
        const { password, ...userWithoutPassword } = users[userIndex];

        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { message: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
