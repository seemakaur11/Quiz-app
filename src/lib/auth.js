import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const usersFilePath = path.join(process.cwd(), 'src', 'lib', 'users.json');

async function readUsers() {
    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users data:', error);
        return [];
    }
}

async function writeUsers(users) {
    try {
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 4), 'utf-8');
    } catch (error) {
        console.error('Error writing users data:', error);
    }
}

export async function authenticateUser(username, password) {
    const users = await readUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}

export async function registerUser(username, password) {
    const users = await readUsers();

    if (users.find(u => u.username === username)) {
        throw new Error('Username already exists');
    }

    const newUser = {
        id: uuidv4(),
        username,
        password, // In a real app, hash this!
        role: 'USER'
    };

    users.push(newUser);
    await writeUsers(users);

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}
