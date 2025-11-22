import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL || process.env.DATABASE_URL!);

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

// Initialize database tables
export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      cover_image TEXT,
      sort_order INT DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      src TEXT NOT NULL,
      caption TEXT,
      description TEXT,
      sort_order INT DEFAULT 0
    )
  `;
}

export async function getData(): Promise<Data> {
  try {
    // Ensure tables exist
    await initDb();

    const categoriesResult = await sql`
      SELECT id, title, cover_image as "coverImage", sort_order
      FROM categories
      ORDER BY sort_order ASC, id ASC
    `;

    const photosResult = await sql`
      SELECT id, category_id, src, caption, description, sort_order
      FROM photos
      ORDER BY sort_order ASC, id ASC
    `;

    const categories: Category[] = categoriesResult.map((cat) => ({
      id: cat.id as string,
      title: cat.title as string,
      coverImage: cat.coverImage as string | undefined,
      photos: photosResult
        .filter((p) => p.category_id === cat.id)
        .map((p) => ({
          id: p.id as string,
          src: p.src as string,
          caption: p.caption as string | undefined,
          description: p.description as string | undefined,
        })),
    }));

    return { categories };
  } catch (error) {
    console.error('Database error:', error);
    return { categories: [] };
  }
}

export async function getCategory(id: string): Promise<Category | undefined> {
  const data = await getData();
  return data.categories.find((c) => c.id === id);
}

export async function addCategory(id: string, title: string): Promise<void> {
  await initDb();
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), 0) as max FROM categories`;
  await sql`
    INSERT INTO categories (id, title, sort_order)
    VALUES (${id}, ${title}, ${(maxOrder[0].max as number) + 1})
  `;
}

export async function deleteCategory(id: string): Promise<void> {
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
  await sql`DELETE FROM photos WHERE id = ${photoId} AND category_id = ${categoryId}`;
}

export async function updateCategoryCover(categoryId: string, src: string): Promise<void> {
  await sql`UPDATE categories SET cover_image = ${src} WHERE id = ${categoryId}`;
}

export async function updatePhoto(
  categoryId: string,
  photoId: string,
  updates: { caption?: string; description?: string }
): Promise<void> {
  if (updates.caption !== undefined) {
    await sql`UPDATE photos SET caption = ${updates.caption} WHERE id = ${photoId} AND category_id = ${categoryId}`;
  }
  if (updates.description !== undefined) {
    await sql`UPDATE photos SET description = ${updates.description} WHERE id = ${photoId} AND category_id = ${categoryId}`;
  }
}

export async function reorderCategories(categoryIds: string[]): Promise<void> {
  for (let i = 0; i < categoryIds.length; i++) {
    await sql`UPDATE categories SET sort_order = ${i} WHERE id = ${categoryIds[i]}`;
  }
}

// Legacy function - no longer used but kept for compatibility
export async function saveData(data: Data): Promise<void> {
  // Not needed with database - individual operations handle saving
}
