'use client';

import { useState, useRef, useTransition } from 'react';
import { Category, Photo } from '@/lib/data';
import { addCategory, deleteCategory, deletePhoto, updateCategoryCover, updatePhoto, reorderCategories, reorderPhotos, addMultiplePhotos, renameCategory, deleteMultiplePhotos } from '@/app/actions';
import { Trash2, Upload, Plus, X, Image as ImageIcon, Edit2, GripVertical, Check, CheckSquare, Square } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableCategoryItem({ id, title, selected, children }: { id: string, title: string, selected: boolean, children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className={`flex justify-between items-center p-3 rounded transition-colors ${selected ? 'bg-black text-white' : 'bg-white hover:bg-gray-100'}`}>
            <div className="flex items-center gap-2">
                <button {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-black"><GripVertical size={18} /></button>
                <span>{title}</span>
            </div>
            {children}
        </div>
    );
}

function SortablePhotoItem({ photo, children }: { photo: Photo, children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: photo.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="relative group aspect-[4/5] bg-gray-100 rounded overflow-hidden">
            <Image src={photo.src} alt={photo.caption || ''} fill className="object-cover" />
             <div className="absolute top-2 left-2 z-10">
                <button {...attributes} {...listeners} className="cursor-grab text-white bg-black/30 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={16} />
                </button>
            </div>
            {children}
        </div>
    );
}


interface Props {
    initialData: { categories: Category[] };
}

export default function AdminDashboard({ initialData }: Props) {
    const [categories, setCategories] = useState(initialData.categories);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        initialData.categories.length > 0 ? initialData.categories[0] : null
    );
    const [isUploading, setIsUploading] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    const [newCategoryTitle, setNewCategoryTitle] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingCategoryTitle, setEditingCategoryTitle] = useState('');
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPending, startTransition] = useTransition();

    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

    async function handleNewCategorySubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!newCategoryTitle.trim()) return;

        const promise = () => new Promise<Category>(async (resolve, reject) => {
            const tempId = `temp-${Date.now()}`;
            setCategories(prev => [...prev, { id: tempId, title: newCategoryTitle.trim(), photos: [] }]);
            setNewCategoryTitle('');
            try {
                const createdCategory = await addCategory(newCategoryTitle.trim());
                setCategories(prev => prev.map(c => c.id === tempId ? createdCategory : c));
                resolve(createdCategory);
            } catch (error) {
                setCategories(prev => prev.filter(c => c.id !== tempId));
                reject(error);
            }
        });

        toast.promise(promise, {
            loading: 'Adding category...',
            success: (cat) => `Category "${cat.title}" added.`,
            error: 'Failed to add category.',
        });
    }

    function handleDeleteCategory(id: string, title: string) {
        toast.warning(`Delete "${title}"?`, {
            description: 'All photos in this category will be permanently deleted.',
            action: {
                label: 'Delete',
                onClick: () => {
                    const promise = () => new Promise<void>(async (resolve, reject) => {
                        const oldCategories = categories;
                        setCategories(prev => prev.filter(c => c.id !== id));
                        if (selectedCategory?.id === id) setSelectedCategory(null);
                        try {
                            await deleteCategory(id);
                            resolve();
                        } catch (error) {
                            setCategories(oldCategories);
                            reject(error);
                        }
                    });
                    toast.promise(promise, {
                        loading: 'Deleting category...',
                        success: `Category "${title}" deleted.`,
                        error: 'Failed to delete category.',
                    });
                }
            },
            cancel: { label: 'Cancel', onClick: () => {} }
        });
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files?.length || !selectedCategory) return;

        const files = Array.from(e.target.files);
        const toastId = toast.loading(`Uploading ${files.length} photo(s)...`);
        setIsUploading(true);

        try {
            const uploadPromises = files.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'portfolio_upload');
                return fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
            });

            const results = await Promise.all(uploadPromises);
            const settledResults = await Promise.all(results.map(res => res.json()));

            const successfullyUploaded = settledResults.filter(res => res.secure_url);

            if (successfullyUploaded.length === 0) {
                throw new Error('All uploads failed');
            }

            const newPhotosData = successfullyUploaded.map(res => ({
                src: res.secure_url,
                caption: ''
            }));

            const newPhotos = await addMultiplePhotos(selectedCategory.id, newPhotosData);
            
            if (newPhotos) {
                const updatedPhotos = [...selectedCategory.photos, ...newPhotos];
                let newCoverImage = selectedCategory.coverImage;

                // Set cover if it was the first photo upload to an empty category
                if (selectedCategory.photos.length === 0 && updatedPhotos.length > 0) {
                    newCoverImage = updatedPhotos[0].src;
                    await updateCategoryCover(selectedCategory.id, updatedPhotos[0].src);
                }

                const updatedCategory = { ...selectedCategory, photos: updatedPhotos, coverImage: newCoverImage };
                setSelectedCategory(updatedCategory);
                setCategories(prev => prev.map(c => c.id === selectedCategory.id ? updatedCategory : c));
            }
            
            if (successfullyUploaded.length < files.length) {
                toast.warning(`${files.length - successfullyUploaded.length} photo(s) failed to upload.`, { id: toastId });
            } else {
                toast.success('All photos uploaded!', { id: toastId });
            }

        } catch (error: any) {
            console.error('Detailed upload error:', error);
            toast.error(`Upload failed: ${error.message}`, { id: toastId });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }

    function handleDeletePhoto(photoId: string) {
        toast.warning('Delete this photo?', {
            action: {
                label: 'Delete',
                onClick: () => {
                    if (!selectedCategory) return;
                    const promise = () => new Promise<void>(async (resolve, reject) => {
                        const oldCategories = categories;
                        const oldSelected = selectedCategory;
                        const updatedPhotos = selectedCategory.photos.filter(p => p.id !== photoId);
                        const updatedCategory = { ...selectedCategory, photos: updatedPhotos };
                        setSelectedCategory(updatedCategory);
                        setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
                        try {
                            await deletePhoto(selectedCategory.id, photoId);
                            resolve();
                        } catch (error) {
                            setCategories(oldCategories);
                            setSelectedCategory(oldSelected);
                            reject(error);
                        }
                    });
                     toast.promise(promise, {
                        loading: 'Deleting photo...',
                        success: 'Photo deleted.',
                        error: 'Failed to delete photo.',
                    });
                }
            },
            cancel: { label: 'Cancel', onClick: () => {} }
        });
    }

    async function handleSetCover(photoSrc: string) {
        if (!selectedCategory) return;
        const promise = () => new Promise<void>(async (resolve, reject) => {
            const oldCategories = categories;
            const oldSelected = selectedCategory;
            const updatedCategory = { ...selectedCategory, coverImage: photoSrc };
            setSelectedCategory(updatedCategory);
            setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
            try {
                await updateCategoryCover(selectedCategory.id, photoSrc);
                resolve();
            } catch (error) {
                setCategories(oldCategories);
                setSelectedCategory(oldSelected);
                reject(error);
            }
        });
        toast.promise(promise, {
            loading: 'Setting cover...',
            success: 'Cover image updated.',
            error: 'Failed to set cover.',
        });
    }

    async function handleUpdatePhoto(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!selectedCategory || !editingPhoto) return;
        const formData = new FormData(e.currentTarget);
        const caption = formData.get('caption') as string;
        const description = formData.get('description') as string;
        
        const promise = () => new Promise<void>(async (resolve, reject) => {
            const oldCategories = categories;
            const oldSelected = selectedCategory;
            const updatedPhotos = selectedCategory.photos.map(p => p.id === editingPhoto.id ? { ...p, caption, description } : p);
            const updatedCategory = { ...selectedCategory, photos: updatedPhotos };
            setSelectedCategory(updatedCategory);
            setCategories(prev => prev.map(c => c.id === selectedCategory.id ? updatedCategory : c));
            setEditingPhoto(null);
            try {
                await updatePhoto(selectedCategory.id, editingPhoto.id, { caption, description });
                resolve();
            } catch (error) {
                setCategories(oldCategories);
                setSelectedCategory(oldSelected);
                reject(error);
            }
        });

         toast.promise(promise, {
            loading: 'Saving changes...',
            success: 'Photo updated.',
            error: 'Failed to save changes.',
        });
    }

    function handleCategoryDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = categories.findIndex(c => c.id === active.id);
            const newIndex = categories.findIndex(c => c.id === over.id);
            const newOrder = arrayMove(categories, oldIndex, newIndex);
            setCategories(newOrder);
            toast.promise(reorderCategories(newOrder.map(c => c.id)), {
                loading: 'Saving order...',
                success: 'Category order saved.',
                error: (err) => {
                    setCategories(categories); // Revert
                    return 'Failed to save order.';
                }
            });
        }
    }

    function handlePhotoDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over && active.id !== over.id && selectedCategory) {
            const oldIndex = selectedCategory.photos.findIndex(p => p.id === active.id);
            const newIndex = selectedCategory.photos.findIndex(p => p.id === over.id);
            const newOrder = arrayMove(selectedCategory.photos, oldIndex, newIndex);
            const oldSelected = selectedCategory;
            const updatedCategory = { ...selectedCategory, photos: newOrder };
            setSelectedCategory(updatedCategory);
            setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));

            toast.promise(reorderPhotos(selectedCategory.id, newOrder.map(p => p.id)), {
                loading: 'Saving order...',
                success: 'Photo order saved.',
                error: (err) => {
                    setSelectedCategory(oldSelected);
                    setCategories(prev => prev.map(c => c.id === oldSelected.id ? oldSelected : c));
                    return 'Failed to save order.';
                }
            });
        }
    }

    function startEditingCategory(id: string, title: string) {
        setEditingCategoryId(id);
        setEditingCategoryTitle(title);
    }

    async function handleRenameCategory(e: React.FormEvent) {
        e.preventDefault();
        if (!editingCategoryId || !editingCategoryTitle.trim()) return;

        const promise = () => new Promise<void>(async (resolve, reject) => {
            const oldCategories = categories;
            const oldSelected = selectedCategory;
            const newTitle = editingCategoryTitle.trim();

            setCategories(prev => prev.map(c => c.id === editingCategoryId ? { ...c, title: newTitle } : c));
            if (selectedCategory?.id === editingCategoryId) {
                setSelectedCategory({ ...selectedCategory, title: newTitle });
            }
            setEditingCategoryId(null);

            try {
                await renameCategory(editingCategoryId, newTitle);
                resolve();
            } catch (error) {
                setCategories(oldCategories);
                setSelectedCategory(oldSelected);
                reject(error);
            }
        });

        toast.promise(promise, {
            loading: 'Renaming category...',
            success: 'Category renamed.',
            error: 'Failed to rename category.',
        });
    }

    function togglePhotoSelection(photoId: string) {
        setSelectedPhotos(prev => {
            const next = new Set(prev);
            if (next.has(photoId)) {
                next.delete(photoId);
            } else {
                next.add(photoId);
            }
            return next;
        });
    }

    function toggleSelectAll() {
        if (!selectedCategory) return;
        if (selectedPhotos.size === selectedCategory.photos.length) {
            setSelectedPhotos(new Set());
        } else {
            setSelectedPhotos(new Set(selectedCategory.photos.map(p => p.id)));
        }
    }

    function handleBulkDelete() {
        if (!selectedCategory || selectedPhotos.size === 0) return;

        const count = selectedPhotos.size;
        toast.warning(`Delete ${count} photo${count > 1 ? 's' : ''}?`, {
            description: 'This action cannot be undone.',
            action: {
                label: 'Delete',
                onClick: () => {
                    const promise = () => new Promise<void>(async (resolve, reject) => {
                        const oldCategories = categories;
                        const oldSelected = selectedCategory;
                        const photoIdsToDelete = Array.from(selectedPhotos);

                        const updatedPhotos = selectedCategory.photos.filter(p => !selectedPhotos.has(p.id));
                        const updatedCategory = { ...selectedCategory, photos: updatedPhotos };
                        setSelectedCategory(updatedCategory);
                        setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
                        setSelectedPhotos(new Set());
                        setSelectionMode(false);

                        try {
                            await deleteMultiplePhotos(selectedCategory.id, photoIdsToDelete);
                            resolve();
                        } catch (error) {
                            setCategories(oldCategories);
                            setSelectedCategory(oldSelected);
                            reject(error);
                        }
                    });

                    toast.promise(promise, {
                        loading: `Deleting ${count} photo${count > 1 ? 's' : ''}...`,
                        success: `${count} photo${count > 1 ? 's' : ''} deleted.`,
                        error: 'Failed to delete photos.',
                    });
                }
            },
            cancel: { label: 'Cancel', onClick: () => {} }
        });
    }

    function exitSelectionMode() {
        setSelectionMode(false);
        setSelectedPhotos(new Set());
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {editingPhoto && (
                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white p-6 rounded-lg w-full max-w-md"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Edit Photo</h3><button onClick={() => setEditingPhoto(null)}><X size={24} /></button></div><form onSubmit={handleUpdatePhoto} className="space-y-4"><div><label className="block text-sm font-medium mb-1">Caption</label><input name="caption" defaultValue={editingPhoto.caption} className="w-full p-2 border rounded" /></div><div><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" defaultValue={editingPhoto.description} className="w-full p-2 border rounded h-32" /></div><div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingPhoto(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button><button type="submit" className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Save</button></div></form></div></div>
            )}
            <div className="md:col-span-1 bg-gray-50 p-6 rounded-lg h-fit">
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                <form onSubmit={handleNewCategorySubmit} className="flex gap-2 mb-6">
                    <input type="text" value={newCategoryTitle} onChange={(e) => setNewCategoryTitle(e.target.value)} placeholder="New Category..." className="flex-1 p-2 border rounded" required />
                    <button type="submit" disabled={isPending} className="bg-black text-white p-2 rounded hover:bg-gray-800 disabled:opacity-50">{isPending ? '...' : <Plus size={20} />}</button>
                </form>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
                    <SortableContext items={categories} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <div key={cat.id} onClick={() => { if (editingCategoryId !== cat.id) { setSelectedCategory(cat); setSelectionMode(false); setSelectedPhotos(new Set()); } }}>
                                    <SortableCategoryItem id={cat.id} title={cat.title} selected={selectedCategory?.id === cat.id}>
                                        {editingCategoryId === cat.id ? (
                                            <form onSubmit={handleRenameCategory} className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                                <input
                                                    type="text"
                                                    value={editingCategoryTitle}
                                                    onChange={(e) => setEditingCategoryTitle(e.target.value)}
                                                    className="flex-1 p-1 border rounded text-sm w-24"
                                                    autoFocus
                                                    onBlur={() => setEditingCategoryId(null)}
                                                    onKeyDown={(e) => { if (e.key === 'Escape') setEditingCategoryId(null); }}
                                                />
                                                <button type="submit" className="text-green-600 hover:text-green-800 p-1" onMouseDown={e => e.preventDefault()}>
                                                    <Check size={16} />
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="flex items-center gap-1">
                                                <button onClick={(e) => { e.stopPropagation(); startEditingCategory(cat.id, cat.title); }} className="text-gray-400 hover:text-blue-600 p-1">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.title); }} className="text-red-500 hover:text-red-700 p-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </SortableCategoryItem>
                                </div>
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
            <div className="md:col-span-2">
                {selectedCategory ? (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{selectedCategory.title}</h2>
                            <div className="flex gap-2">
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" multiple />
                                {selectionMode ? (
                                    <>
                                        <button onClick={toggleSelectAll} className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100">
                                            {selectedPhotos.size === selectedCategory.photos.length ? <CheckSquare size={18} /> : <Square size={18} />}
                                            {selectedPhotos.size === selectedCategory.photos.length ? 'Deselect All' : 'Select All'}
                                        </button>
                                        <button
                                            onClick={handleBulkDelete}
                                            disabled={selectedPhotos.size === 0}
                                            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                                        >
                                            <Trash2 size={18} /> Delete ({selectedPhotos.size})
                                        </button>
                                        <button onClick={exitSelectionMode} className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100">
                                            <X size={18} /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {selectedCategory.photos.length > 0 && (
                                            <button onClick={() => setSelectionMode(true)} className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100">
                                                <CheckSquare size={18} /> Select
                                            </button>
                                        )}
                                        <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50">
                                            {isUploading ? 'Uploading...' : <><Upload size={18} /> Upload</>}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePhotoDragEnd}>
                            <SortableContext items={selectedCategory.photos} strategy={rectSortingStrategy}>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {selectedCategory.photos.map((photo) => (
                                        <SortablePhotoItem key={photo.id} photo={photo}>
                                            {selectionMode ? (
                                                <div
                                                    className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer"
                                                    onClick={() => togglePhotoSelection(photo.id)}
                                                >
                                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedPhotos.has(photo.id) ? 'bg-blue-500 border-blue-500' : 'border-white bg-black/20'}`}>
                                                        {selectedPhotos.has(photo.id) && <Check size={18} className="text-white" />}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                    <button onClick={() => handleSetCover(photo.src)} className="bg-white text-black px-3 py-1 rounded text-xs hover:bg-gray-200">Set Cover</button>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setEditingPhoto(photo)} className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"><Edit2 size={16} /></button>
                                                        <button onClick={() => handleDeletePhoto(photo.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            )}
                                            {selectedCategory.coverImage === photo.src && (<div className="absolute top-2 right-2 bg-yellow-400 text-black p-1 rounded-full shadow-sm"><ImageIcon size={12} /></div>)}
                                        </SortablePhotoItem>
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                        {selectedCategory.photos.length === 0 && (<div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">No photos yet. Upload one to get started.</div>)}
                    </div>
                ) : (<div className="h-full flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg min-h-[400px]">Select a category to manage photos</div>)}
            </div>
        </div>
    );
}
