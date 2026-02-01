"use client"
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function ProfilePage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [userSpots, setUserSpots] = useState([]);
    const [stats, setStats] = useState({ totalSpots: 0, totalLikes: 0 });

    useEffect(() => {
        if (!session) {
            router.push('/Login');
            return;
        }

        const savedSpots = localStorage.getItem('communitySpots');
        if (savedSpots) {
            const allSpots = JSON.parse(savedSpots);
            // Filter spots added by this user (or just show all for demo purposes)
            // For this demo, we'll show spots where contributor name matches or first 3
            const spots = allSpots.filter(spot =>
                spot.contributor.toLowerCase() === session.user.name?.toLowerCase() ||
                spot.contributor === 'Anonymous'
            );
            setUserSpots(spots);

            const likes = spots.reduce((acc, s) => acc + (s.likes || 0), 0);
            setStats({ totalSpots: spots.length, totalLikes: likes });
        }
    }, [session]);

    if (!session) return null;

    return (
        <div className='min-h-screen bg-gray-50 pb-20'>
            {/* Hero Header */}
            <div className='h-64 bg-gradient-to-br from-blue-600 to-indigo-900 relative flex items-end justify-center pb-12'>
                <div className='absolute inset-0 overflow-hidden'>
                    <div className='absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2'></div>
                    <div className='absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2'></div>
                </div>

                <div className='relative flex flex-col items-center'>
                    <div className='p-1 bg-white rounded-full shadow-2xl'>
                        <Image
                            src={session.user.image || '/user-location.png'}
                            alt='profile'
                            width={120}
                            height={120}
                            className='rounded-full border-4 border-white'
                        />
                    </div>
                    <h1 className='text-3xl font-black text-white mt-4 tracking-tight'>{session.user.name}</h1>
                    <p className='text-blue-100 font-medium opacity-80'>{session.user.email}</p>
                </div>
            </div>

            {/* Stats Section */}
            <div className='max-w-5xl mx-auto -mt-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center border border-gray-100 hover:scale-105 transition-transform'>
                    <span className='text-3xl mb-2'>📍</span>
                    <span className='text-2xl font-black text-gray-900'>{stats.totalSpots}</span>
                    <span className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Spots Discovered</span>
                </div>
                <div className='bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center border border-gray-100 hover:scale-105 transition-transform'>
                    <span className='text-3xl mb-2'>❤️</span>
                    <span className='text-2xl font-black text-gray-900'>{stats.totalLikes}</span>
                    <span className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Impact Score</span>
                </div>
                <div className='bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center border border-gray-100 hover:scale-105 transition-transform'>
                    <span className='text-3xl mb-2'>🏆</span>
                    <span className='text-2xl font-black text-gray-900'>Pro Explorer</span>
                    <span className='text-xs font-bold text-gray-400 uppercase tracking-widest'>Current Rank</span>
                </div>
            </div>

            {/* Content Section */}
            <div className='max-w-5xl mx-auto px-4 mt-12'>
                <div className='flex justify-between items-center mb-8'>
                    <h2 className='text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3'>
                        My Discoveries
                        <span className='px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-black'>{userSpots.length}</span>
                    </h2>
                    <button
                        onClick={() => signOut()}
                        className='px-6 py-2 bg-red-50 text-red-600 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all'
                    >
                        Sign Out
                    </button>
                </div>

                {userSpots.length === 0 ? (
                    <div className='bg-white rounded-[2.5rem] p-20 flex flex-col items-center text-center shadow-lg border border-dashed border-gray-200'>
                        <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-4xl mb-6'>🗺️</div>
                        <h3 className='text-xl font-bold text-gray-800'>No spots pinned yet</h3>
                        <p className='text-gray-500 mt-2 max-w-sm'>Adventure awaits! Head back to the map and contribute your first hidden gem.</p>
                        <button
                            onClick={() => router.push('/')}
                            className='mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-105 transition-all'
                        >
                            Back to Map
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {userSpots.map((spot) => (
                            <div key={spot.id} className='bg-white p-6 rounded-[2rem] shadow-lg border border-gray-50 group hover:shadow-2xl transition-all'>
                                <div className='flex justify-between items-start mb-4'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl'>
                                            {spot.category === 'restaurant' ? '🍔' : spot.category === 'cafe' ? '☕' : spot.category === 'bar' ? '🍷' : '🌳'}
                                        </div>
                                        <div>
                                            <h3 className='font-black text-gray-900'>{spot.name}</h3>
                                            <p className='text-xs text-gray-400 font-medium'>{new Date(spot.addedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-end'>
                                        <span className='text-red-500 font-black text-sm'>❤️ {spot.likes || 0}</span>
                                    </div>
                                </div>
                                <p className='text-sm text-gray-600 italic line-clamp-2'>"{spot.description}"</p>
                                <div className='mt-4 flex flex-wrap gap-2'>
                                    {spot.tags?.map(tag => (
                                        <span key={tag} className='px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-bold border border-gray-100'>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfilePage
