"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function HeaderNavBar() {
  const { data: session } = useSession();
  const [profileClick, setProfileClick] = useState(false);
  const router = useRouter();

  return session?.user && (
    <div className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-[50] border-b border-gray-100 shadow-sm">
      <div className="flex gap-10 items-center">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => router.push('/')}
        >
          <div className="p-1.5 bg-gray-900 rounded-xl group-hover:rotate-6 transition-transform">
            <Image src="/logo.png" alt="logo" width={32} height={32} className="invert brightness-0" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-gray-900">PLACEMAP</h1>
        </div>

        <div className="hidden md:flex gap-8">
          <h2
            className="text-sm font-black text-gray-400 hover:text-gray-900 cursor-pointer uppercase tracking-widest transition-colors"
            onClick={() => router.push('/')}
          >
            Map
          </h2>
          <h2
            className="text-sm font-black text-gray-400 hover:text-gray-900 cursor-pointer uppercase tracking-widest transition-colors"
            onClick={() => router.push('/explore')}
          >
            Explore
          </h2>
          <h2
            className="text-sm font-black text-gray-400 hover:text-gray-900 cursor-pointer uppercase tracking-widest transition-colors"
            onClick={() => router.push('/profile')}
          >
            Profile
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-2xl hidden md:flex items-center gap-3 w-64 focus-within:w-80 focus-within:ring-2 ring-blue-100 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" placeholder="Search gems..." className="bg-transparent outline-none w-full text-xs font-bold text-gray-600 placeholder:text-gray-300" />
        </div>

        <div className="relative">
          <button
            onClick={() => setProfileClick(!profileClick)}
            className="flex items-center gap-2 p-1 pl-3 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter truncate max-w-[80px]">
              {session.user.name}
            </span>
            <Image
              src={session.user.image || '/user-location.png'}
              alt="user"
              width={32}
              height={32}
              className="rounded-xl border-2 border-white shadow-sm"
            />
          </button>

          {profileClick && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-gray-50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account</p>
                <p className="text-xs font-bold text-gray-900 truncate">{session.user.email}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { router.push('/profile'); setProfileClick(false); }}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-3"
                >
                  👤 My Profile
                </button>
                <button
                  onClick={() => { router.push('/explore'); setProfileClick(false); }}
                  className="w-full text-left px-4 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors flex items-center gap-3"
                >
                  ✨ Discover
                </button>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-colors border-t border-gray-50 mt-2 flex items-center gap-3"
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderNavBar;
