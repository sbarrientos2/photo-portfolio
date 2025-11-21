'use server';

import { getData, saveData, Category, Photo } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

export async function addCategory(formData: FormData) {
    const title = formData.get('title') as string;
    if (!title) return;

    const data = await getData();
    const newCategory: Category = {
        id: title.toLowerCase().replace(/\s+/g, '-'),
        title,
        photos: [],
    };

    data.categories.push(newCategory);
    await saveData(data);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteCategory(id: string) {
    const data = await getData();
    data.categories = data.categories.filter((c) => c.id !== id);
    await saveData(data);
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function addPhoto(categoryId: string, src: string, caption: string) {
    const data = await getData();
    const category = data.categories.find((c) => c.id === categoryId);

    if (category) {
        const newPhoto: Photo = {
            id: uuidv4(),
            src,
            caption,
        };
        category.photos.push(newPhoto);
        // Update cover image if it's the first photo
        if (!category.coverImage) {
            category.coverImage = src;
        }
        await saveData(data);
        revalidatePath(`/portfolio/${categoryId}`);
        revalidatePath('/admin');
        revalidatePath('/');
        return newPhoto;
    }
    return null;
}

export async function deletePhoto(categoryId: string, photoId: string) {
    const data = await getData();
    const category = data.categories.find((c) => c.id === categoryId);

    if (category) {
        category.photos = category.photos.filter((p) => p.id !== photoId);
        await saveData(data);
        revalidatePath(`/portfolio/${categoryId}`);
        revalidatePath('/admin');
    }
}

export async function updateCategoryCover(categoryId: string, src: string) {
    const data = await getData();
    const category = data.categories.find((c) => c.id === categoryId);
    if (category) {
        category.coverImage = src;
        await saveData(data);
        revalidatePath('/');
        revalidatePath('/admin');
    }
}

export async function updatePhoto(categoryId: string, photoId: string, updates: { caption?: string; description?: string }) {
    const data = await getData();
    const category = data.categories.find((c) => c.id === categoryId);

    if (category) {
        const photo = category.photos.find((p) => p.id === photoId);
        if (photo) {
            if (updates.caption !== undefined) photo.caption = updates.caption;
            if (updates.description !== undefined) photo.description = updates.description;

            await saveData(data);
            revalidatePath(`/portfolio/${categoryId}`);
            revalidatePath('/admin');
        }
    }
}

export async function reorderCategories(categoryIds: string[]) {
    const data = await getData();

    // Reorder categories based on the provided order of IDs
    const reorderedCategories = categoryIds
        .map(id => data.categories.find(c => c.id === id))
        .filter((c): c is Category => c !== undefined);

    data.categories = reorderedCategories;
    await saveData(data);
    revalidatePath('/');
    revalidatePath('/admin');
}
