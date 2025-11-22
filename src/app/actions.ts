'use server';

import {
    addCategory as dbAddCategory,
    deleteCategory as dbDeleteCategory,
    addPhoto as dbAddPhoto,
    deletePhoto as dbDeletePhoto,
    updateCategoryCover as dbUpdateCategoryCover,
    updatePhoto as dbUpdatePhoto,
    reorderCategories as dbReorderCategories,
    Photo,
} from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function addCategory(formData: FormData) {
    const title = formData.get('title') as string;
    if (!title) return;

    const id = title.toLowerCase().replace(/\s+/g, '-');
    await dbAddCategory(id, title);

    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteCategory(id: string) {
    await dbDeleteCategory(id);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function addPhoto(categoryId: string, src: string, caption: string): Promise<Photo | null> {
    const photoId = uuidv4();
    const photo = await dbAddPhoto(categoryId, photoId, src, caption);

    revalidatePath(`/portfolio/${categoryId}`);
    revalidatePath('/admin');
    revalidatePath('/');

    return photo;
}

export async function deletePhoto(categoryId: string, photoId: string) {
    await dbDeletePhoto(categoryId, photoId);
    revalidatePath(`/portfolio/${categoryId}`);
    revalidatePath('/admin');
}

export async function updateCategoryCover(categoryId: string, src: string) {
    await dbUpdateCategoryCover(categoryId, src);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updatePhoto(categoryId: string, photoId: string, updates: { caption?: string; description?: string }) {
    await dbUpdatePhoto(categoryId, photoId, updates);
    revalidatePath(`/portfolio/${categoryId}`);
    revalidatePath('/admin');
}

export async function reorderCategories(categoryIds: string[]) {
    await dbReorderCategories(categoryIds);
    revalidatePath('/');
    revalidatePath('/admin');
}
