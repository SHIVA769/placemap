"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

function ExploreFeed() {
    const [allSpots, setAllSpots] = useState([]);
    const [filter, setFilter] = useState('all');
    const router = useRouter();

    useEffect(() => {
        const savedSpots = localStorage.getItem('communitySpots');
        if (savedSpots) {
            setAllSpots(JSON.parse(savedSpots).sort((a, b) => b.likes - a.likes));
        }
    }, []);

    const filteredSpots = filter === 'all'
        ? allSpots
        : allSpots.filter(spot => spot.category === filter);

    return (
        <div className='min-h-screen bg-gray-50 pb-20'>
            {/* Header */}
            <div className='bg-white border-b border-gray-100 py-10 px-4'>
                <div className='max-w-6xl mx-auto'>
                    <h1 className='text-4xl font-black text-gray-900 tracking-tight mb-4'>
                        Community Feed ✨
                    </h1>
                    <p className='text-gray-500 max-w-xl font-medium'>
                        Discover the best hidden gems curated by our explorers. From quiet cafes to lively bars, find your next favorite spot.
                    </p>

                    {/* Category Filter */}
                    <div className='flex gap-3 mt-10 overflow-x-auto pb-2 scrollbar-hide'>
                        {['all', 'restaurant', 'cafe', 'bar', 'park'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${filter === cat
                                        ? 'bg-gray-900 text-white shadow-xl shadow-gray-200 scale-105'
                                        : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className='max-w-6xl mx-auto px-4 mt-12'>
                {filteredSpots.length === 0 ? (
                    <div className='flex flex-col items-center py-20 opacity-30'>
                        <span className='text-6xl mb-4'>🔍</span>
                        <p className='font-bold text-xl'>No spots found in this category</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {filteredSpots.map((spot) => (
                            <div key={spot.id} className='bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-2xl transition-all hover:-translate-y-2'>
                                <div className='relative h-48 bg-gray-100 flex items-center justify-center text-5xl'>
                                    {/* In a real app we'd show an image here. Using emoji for demo. */}
                                    <span className='group-hover:scale-125 transition-transform duration-500'>
                                        {spot.category === 'restaurant' ? '🍔' : spot.category === 'cafe' ? '☕' : spot.category === 'bar' ? '🍷' : '🌳'}
                                    </span>
                                    <div className='absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm'>
                                        <span className='text-red-500 font-black text-xs'>❤️ {spot.likes || 0}</span>
                                    </div>
                                </div>

                                <div className='p-8'>
                                    <div className='flex justify-between items-start mb-4'>
                                        <div>
                                            <h3 className='text-xl font-black text-gray-900 leading-tight mb-1'>{spot.name}</h3>
                                            <p className='text-[10px] font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2'>
                                                <span className='w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse'></span>
                                                {spot.category}
                                            </p>
                                        </div>
                                    </div>

                                    <p className='text-sm text-gray-500 italic mb-6 line-clamp-2 leading-relaxed'>
                                        "{spot.description}"
                                    </p>

                                    <div className='flex flex-wrap gap-2 mb-8'>
                                        {spot.tags?.map(tag => (
                                            <span key={tag} className='px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[9px] font-bold border border-gray-100'>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className='pt-6 border-t border-gray-50 flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 font-bold text-[10px] flex items-center justify-center'>
                                                {spot.contributor?.charAt(0)}
                                            </div>
                                            <span className='text-[11px] font-bold text-gray-400'>{spot.contributor}</span>
                                        </div>
                                        <button
                                            onClick={() => router.push('/')}
                                            className='text-[10px] font-black text-blue-600 hover:underline underline-offset-4 decoration-2'
                                        >
                                            SHOW ON MAP
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ExploreFeed
