"use client"
import React, { useState } from 'react'

function AddPlaceModal({ location, onSave, onCancel }) {
    const [name, setName] = useState('')
    const [contributor, setContributor] = useState('')
    const [category, setCategory] = useState('restaurant')
    const [description, setDescription] = useState('')
    const [selectedTags, setSelectedTags] = useState([])

    const categories = [
        { id: 1, name: 'Restaurant', value: 'restaurant', icon: '/hamburger.png' },
        { id: 2, name: 'Cafe', value: 'cafe', icon: '/bento.png' },
        { id: 3, name: 'Bar', value: 'bar', icon: '/pizza.png' },
        { id: 4, name: 'Park', value: 'park', icon: '/circle.png' },
    ]

    const vibes = [
        { id: 1, label: 'Quiet', icon: '🤫' },
        { id: 2, label: 'Lively', icon: '🎸' },
        { id: 3, label: 'Work Friendly', icon: '💻' },
        { id: 4, label: 'Budget', icon: '💰' },
        { id: 5, label: 'Insta-worthy', icon: '📸' },
    ]

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag))
        } else {
            setSelectedTags([...selectedTags, tag])
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 px-4">
            <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl w-full max-w-[450px] border border-white/20 transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                        ✨ Add Community Spot
                    </h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Place Name</label>
                            <input
                                type="text"
                                placeholder="Delicious Hub"
                                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Your Name</label>
                            <input
                                type="text"
                                placeholder="Explorer"
                                className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                                value={contributor}
                                onChange={(e) => setContributor(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.value)}
                                    className={`flex items-center gap-2.5 p-3 border-2 rounded-2xl transition-all ${category === cat.value
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                                            : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
                                        }`}
                                >
                                    <img src={cat.icon} alt={cat.name} className={`w-5 h-5 ${category === cat.value ? 'invert brightness-0' : ''}`} />
                                    <span className="text-xs font-bold">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Vibe Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {vibes.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleTag(tag.label)}
                                    className={`px-3 py-2 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${selectedTags.includes(tag.label)
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    <span>{tag.icon}</span>
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Story / Tip</label>
                        <textarea
                            placeholder="Tell us what's awesome here..."
                            className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 pt-4 sticky bottom-0 bg-white/90 backdrop-blur-sm -mx-2 px-2 pb-2">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave({
                                name,
                                contributor: contributor || 'Anonymous',
                                category,
                                description,
                                tags: selectedTags,
                                location,
                                addedAt: new Date().toISOString()
                            })}
                            disabled={!name}
                            className="flex-1 px-4 py-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-blue-200 active:scale-95 disabled:opacity-50 transition-all"
                        >
                            Pin to Map
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddPlaceModal
