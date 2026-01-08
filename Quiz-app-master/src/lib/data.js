import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'quizzes.json');

async function readData() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading quiz data:', error);
        return [];
    }
}

async function writeData(quizzes) {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(quizzes, null, 4), 'utf-8');
    } catch (error) {
        console.error('Error writing quiz data:', error);
    }
}

export async function getQuizzes() {
    return await readData();
}

export async function getQuizById(id) {
    const quizzes = await readData();
    return quizzes.find(q => q.id === id);
}

export async function createQuiz(quiz) {
    const quizzes = await readData();
    quizzes.push(quiz);
    await writeData(quizzes);
}
