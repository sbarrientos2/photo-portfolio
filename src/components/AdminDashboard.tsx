'use client';

import { useState, useRef } from 'react';
import { Category, Photo } from '@/lib/data';
import { addCategory, deleteCategory, addPhoto, deletePhoto, updateCategoryCover, updatePhoto, reorderCategories } from '@/app/actions';
import { Trash2, Upload, Plus, X, Image as ImageIcon, Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface Props {
    initialData: { categories: Category[] };
}

export default function AdminDashboard({ initialData }: Props) {
    const [categories, setCategories] = useState(initialData.categories);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleAddCategory(formData: FormData) {
        await addCategory(formData);
        window.location.reload();
    }

    async function handleDeleteCategory(id: string) {
        if (!confirm('Are you sure? This will delete all photos in this category.')) return;
        await deleteCategory(id);
        window.location.reload();
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length || !selectedCategory) return;
        setIsUploading(true);

        const file = e.target.files[0];

        try {
            // Upload directly to Cloudinary using unsigned preset
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'portfolio_upload');

            const cloudinaryRes = await fetch(
                'https://api.cloudinary.com/v1_1/djxbbt7hx/image/upload',
                { method: 'POST', body: formData }
            );
            const cloudinaryData = await cloudinaryRes.json();

            if (cloudinaryData.secure_url) {
                const newPhoto = await addPhoto(selectedCategory.id, cloudinaryData.secure_url, file.name.split('.')[0]);

                if (newPhoto) {
                    const updatedPhotos = [...selectedCategory.photos, newPhoto];
                    const updatedCategory = { ...selectedCategory, photos: updatedPhotos };

                    // If it's the first photo, it becomes the cover
                    if (updatedPhotos.length === 1) {
                        updatedCategory.coverImage = newPhoto.src;
                    }

                    setSelectedCategory(updatedCategory);
                    setCategories(prev => prev.map(c => c.id === selectedCategory.id ? updatedCategory : c));
                }
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }

    async function handleDeletePhoto(photoId: string) {
        if (!selectedCategory || !confirm('Delete this photo?')) return;
        await deletePhoto(selectedCategory.id, photoId);
        window.location.reload();
    }

    async function handleSetCover(photoSrc: string) {
        if (!selectedCategory) return;
        await updateCategoryCover(selectedCategory.id, photoSrc);
        window.location.reload();
    }

    async function handleUpdatePhoto(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!selectedCategory || !editingPhoto) return;

        const formData = new FormData(e.currentTarget);
        const caption = formData.get('caption') as string;
        const description = formData.get('description') as string;

        await updatePhoto(selectedCategory.id, editingPhoto.id, { caption, description });

        // Update local state
        const updatedPhotos = selectedCategory.photos.map(p =>
            p.id === editingPhoto.id ? { ...p, caption, description } : p
        );

        const updatedCategory = { ...selectedCategory, photos: updatedPhotos };
        setSelectedCategory(updatedCategory);

        setCategories(prev => prev.map(c => c.id === selectedCategory.id ? updatedCategory : c));

        setEditingPhoto(null);
    }

    async function handleMoveCategory(index: number, direction: 'up' | 'down') {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === categories.length - 1) return;

        const newCategories = [...categories];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap
        [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];

        setCategories(newCategories);

        // Persist to server
        await reorderCategories(newCategories.map(c => c.id));
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Edit Modal */}
            {editingPhoto && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Edit Photo</h3>
                            <button onClick={() => setEditingPhoto(null)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleUpdatePhoto} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Caption</label>
                                <input
                                    name="caption"
                                    defaultValue={editingPhoto.caption}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={editingPhoto.description}
                                    className="w-full p-2 border rounded h-32"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingPhoto(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sidebar: Categories */}
            <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg h-fit">
                <h2 className="text-xl font-bold mb-4">Categories</h2>

                <form action={handleAddCategory} className="flex gap-2 mb-6">
                    <input
                        type="text"
                        name="title"
                        placeholder="New Category..."
                        className="flex-1 p-2 border rounded"
                        required
                    />
                    <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-800">
                        <Plus size={20} />
                    </button>
                </form>

                <div className="space-y-2">
                    {categories.map((cat, index) => (
                        <div
                            key={cat.id}
                            className={`flex justify-between items-center p-3 rounded cursor-pointer transition-colors ${selectedCategory?.id === cat.id ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            <span>{cat.title}</span>
                            <div className="flex items-center gap-1">
                                <div className="flex flex-col mr-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleMoveCategory(index, 'up'); }}
                                        disabled={index === 0}
                                        className="text-gray-400 hover:text-white disabled:opacity-30"
                                    >
                                        <ChevronUp size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleMoveCategory(index, 'down'); }}
                                        disabled={index === categories.length - 1}
                                        className="text-gray-400 hover:text-white disabled:opacity-30"
                                    >
                                        <ChevronDown size={14} />
                                    </button>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }}
                                    className="text-red-500 hover:text-red-700 p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main: Photos */}
            <div className="md:col-span-2">
                {selectedCategory ? (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{selectedCategory.title}</h2>
                            <div className="flex gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
                                >
                                    {isUploading ? 'Uploading...' : <><Upload size={18} /> Upload Photo</>}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {selectedCategory.photos.map((photo) => (
                                <div key={photo.id} className="relative group aspect-[4/5] bg-gray-100 rounded overflow-hidden">
                                    <Image
                                        src={photo.src}
                                        alt={photo.caption || ''}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleSetCover(photo.src)}
                                            className="bg-white text-black px-3 py-1 rounded text-xs hover:bg-gray-200"
                                        >
                                            Set Cover
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingPhoto(photo)}
                                                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePhoto(photo.id)}
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    {selectedCategory.coverImage === photo.src && (
                                        <div className="absolute top-2 right-2 bg-yellow-400 text-black p-1 rounded-full shadow-sm">
                                            <ImageIcon size={12} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {selectedCategory.photos.length === 0 && (
                            <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                No photos yet. Upload one to get started.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg min-h-[400px]">
                        Select a category to manage photos
                    </div>
                )}
            </div>
        </div>
    );
}
