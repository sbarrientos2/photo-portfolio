import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export interface Photo {
  id: string;
  src: string;
  caption?: string;
  description?: string;
}

export interface Category {
  id: string;
  title: string;
  coverImage?: string;
  photos: Photo[];
}

export interface Data {
  categories: Category[];
}

export async function getData(): Promise<Data> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty structure
    return { categories: [] };
  }
}

export async function saveData(data: Data): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getCategory(id: string): Promise<Category | undefined> {
  const data = await getData();
  return data.categories.find((c) => c.id === id);
}
