import { sql, initDb } from './db';

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
    // Ensure tables exist
    await initDb();

    const categoriesResult = await sql`
      SELECT
        c.id,
        c.title,
        c.cover_image as "coverImage",
        COALESCE(
          (
            SELECT json_agg(p.* ORDER BY p.sort_order ASC, p.id ASC)
            FROM photos p
            WHERE p.category_id = c.id
          ),
          '[]'::json
        ) as photos
      FROM categories c
      ORDER BY c.sort_order ASC, c.id ASC
    `;

    const categories = categoriesResult.map((cat) => ({
      ...cat,
      photos: (cat.photos as Photo[]) || [],
    })) as Category[];

    return { categories };
  } catch (error) {
    console.error('Database error:', error);
    return { categories: [] };
  }
}

export async function getCategory(id: string): Promise<Category | undefined> {
  try {
    await initDb();
    const result = await sql`
      SELECT
        c.id,
        c.title,
        c.cover_image as "coverImage",
        COALESCE(
          (
            SELECT json_agg(p.* ORDER BY p.sort_order ASC, p.id ASC)
            FROM photos p
            WHERE p.category_id = c.id
          ),
          '[]'::json
        ) as photos
      FROM categories c
      WHERE c.id = ${id}
    `;

    if (result.length === 0) {
      return undefined;
    }

    const cat = result[0];
    return {
      ...cat,
      photos: (cat.photos as Photo[]) || [],
    } as Category;
  } catch (error) {
    console.error('Database error:', error);
    return undefined;
  }
}

export async function addCategory(id: string, title: string): Promise<Category> {
  await initDb();
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), 0) as max FROM categories`;
  await sql`
    INSERT INTO categories (id, title, sort_order)
    VALUES (${id}, ${title}, ${(maxOrder[0].max as number) + 1})
  `;
  return {
    id,
    title,
    photos: [],
  }
}

export async function deleteCategory(id: string): Promise<void> {
  await initDb();
  await sql`DELETE FROM categories WHERE id = ${id}`;
}

export async function addPhoto(
  categoryId: string,
  photoId: string,
  src: string,
  caption: string
): Promise<Photo> {
  await initDb();
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), 0) as max FROM photos WHERE category_id = ${categoryId}`;
  await sql`
    INSERT INTO photos (id, category_id, src, caption, sort_order)
    VALUES (${photoId}, ${categoryId}, ${src}, ${caption}, ${(maxOrder[0].max as number) + 1})
  `;

  // Set as cover if first photo
  const photoCount = await sql`SELECT COUNT(*) as count FROM photos WHERE category_id = ${categoryId}`;
  if (photoCount[0].count === 1) {
    await sql`UPDATE categories SET cover_image = ${src} WHERE id = ${categoryId}`;
  }

  return { id: photoId, src, caption };
}

export async function deletePhoto(categoryId: string, photoId: string): Promise<void> {
  await initDb();
  await sql`DELETE FROM photos WHERE id = ${photoId} AND category_id = ${categoryId}`;
}

export async function updateCategoryCover(categoryId: string, src: string): Promise<void> {
  await initDb();
  await sql`UPDATE categories SET cover_image = ${src} WHERE id = ${categoryId}`;
}

export async function updatePhoto(
  categoryId: string,
  photoId: string,
  updates: { caption?: string; description?: string }
): Promise<void> {
  await initDb();
  if (updates.caption !== undefined) {
    await sql`UPDATE photos SET caption = ${updates.caption} WHERE id = ${photoId} AND category_id = ${categoryId}`;
  }
  if (updates.description !== undefined) {
    await sql`UPDATE photos SET description = ${updates.description} WHERE id = ${photoId} AND category_id = ${categoryId}`;
  }
}

export async function reorderCategories(categoryIds: string[]): Promise<void> {
  await initDb();
  for (let i = 0; i < categoryIds.length; i++) {
    await sql`UPDATE categories SET sort_order = ${i} WHERE id = ${categoryIds[i]}`;
  }
}

export async function reorderPhotos(categoryId: string, photoIds: string[]): Promise<void> {
  await initDb();
  for (let i = 0; i < photoIds.length; i++) {
    await sql`UPDATE photos SET sort_order = ${i} WHERE id = ${photoIds[i]} AND category_id = ${categoryId}`;
  }
}
