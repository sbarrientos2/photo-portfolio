'use server';

import {
    addCategory as dbAddCategory,
    deleteCategory as dbDeleteCategory,
    addPhoto as dbAddPhoto,
    deletePhoto as dbDeletePhoto,
    updateCategoryCover as dbUpdateCategoryCover,
    updatePhoto as dbUpdatePhoto,
    reorderCategories as dbReorderCategories,
    reorderPhotos as dbReorderPhotos,
    addMultiplePhotos as dbAddMultiplePhotos,
    renameCategory as dbRenameCategory,
    deleteMultiplePhotos as dbDeleteMultiplePhotos,
    Photo,
} from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function addCategory(title: string) {
    if (!title) {
        throw new Error("Title is required");
    }

    const id = title.toLowerCase().replace(/\s+/g, '-').slice(0, 50);
    const newCategory = await dbAddCategory(id, title);

    revalidatePath('/');
    revalidatePath('/admin');
    
    return newCategory;
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

export async function reorderPhotos(categoryId: string, photoIds: string[]) {
    await dbReorderPhotos(categoryId, photoIds);
    revalidatePath(`/portfolio/${categoryId}`);
    revalidatePath('/admin');
}

export async function addMultiplePhotos(categoryId: string, photos: {src: string, caption: string}[]) {
    const photosWithIds = photos.map(p => ({ ...p, id: uuidv4() }));
    await dbAddMultiplePhotos(categoryId, photosWithIds);

    revalidatePath(`/portfolio/${categoryId}`);
    revalidatePath('/admin');
    revalidatePath('/');

    return photosWithIds;
}

export async function renameCategory(categoryId: string, newTitle: string) {
    if (!newTitle.trim()) {
        throw new Error("Title is required");
    }
    await dbRenameCategory(categoryId, newTitle.trim());
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath(`/portfolio/${categoryId}`);
}

export async function deleteMultiplePhotos(categoryId: string, photoIds: string[]) {
    if (photoIds.length === 0) return;
    await dbDeleteMultiplePhotos(categoryId, photoIds);
    revalidatePath(`/portfolio/${categoryId}`);
    revalidatePath('/admin');
    revalidatePath('/');
}
