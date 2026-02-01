"use client"
import React from 'react'

function Leaderboard({ communitySpots }) {
    // Aggregate contributions by name
    const contributions = communitySpots.reduce((acc, spot) => {
        const name = spot.contributor || 'Anonymous'
        acc[name] = (acc[name] || 0) + 1
        return acc
    }, {})

    // Sort and take top 5
    const leaders = Object.entries(contributions)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

    // if (leaders.length === 0) return null

    return (
        <div className="mt-8 bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-[2rem] text-white shadow-xl border border-white/10 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

            <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                🏆 Top Explorers
            </h3>

            <div className="space-y-4">
                {leaders.length > 0 ? (
                    leaders.map((user, index) => (
                        <div key={user.name} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 ${index === 0 ? 'bg-yellow-400 border-yellow-200 text-yellow-900' :
                                    index === 1 ? 'bg-slate-300 border-slate-100 text-slate-700' :
                                        index === 2 ? 'bg-orange-400 border-orange-200 text-orange-900' :
                                            'bg-white/10 border-white/5 text-white'
                                    }`}>
                                    {index + 1}
                                </div>
                                <span className="text-sm font-bold tracking-tight group-hover:translate-x-1 transition-transform truncate max-w-[120px]">
                                    {user.name}
                                </span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-black text-blue-400">{user.count}</span>
                                <span className="text-[8px] text-white/40 uppercase font-bold">Spots</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-4 text-center">
                        <p className="text-xs text-white/40 font-bold uppercase tracking-widest px-4">
                            No explorers yet. Be the first to add a spot!
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-[10px] text-white/50 font-medium italic">
                    Keep exploring to climb the ranks! 🚀
                </p>
            </div>
        </div>
    )
}

export default Leaderboard
