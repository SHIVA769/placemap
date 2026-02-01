"use client"
import GlobalApi from '@/Shared/GlobalApi';
import BusinessList from '@/components/Home/BusinessList';
import CategoryList from '@/components/Home/CategoryList';
import GoogleMapView from '@/components/Home/GoogleMapView';
import RangeSelect from '@/components/Home/RangeSelect';
import SelectRating from '@/components/Home/SelectRating';
import SkeltonLoading from '@/components/SkeltonLoading';
import { UserLocationContext } from '@/context/UserLocationContext';
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react'

import AddPlaceModal from '@/components/Home/AddPlaceModal';
import Leaderboard from '@/components/Home/Leaderboard';

export default function Home() {

  const { data: session } = useSession();
  const [category, setCategory] = useState();
  const [radius, setRadius] = useState(2500);
  const [businessList, setBusinessList] = useState([])
  const [businessListOrg, setBusinessListOrg] = useState([])
  const [loading, setLoading] = useState(false);
  const [communitySpots, setCommunitySpots] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const router = useRouter()
  const { userLocation, setUserLocation } = useContext(UserLocationContext);

  useEffect(() => {
    const savedSpots = localStorage.getItem('communitySpots');
    if (savedSpots) {
      setCommunitySpots(JSON.parse(savedSpots));
    }
  }, []);

  useEffect(() => {
    if (!session?.user) {
      router.push('/Login')
    }
  }, [session])

  useEffect(() => {
    getGooglePlace();
  }, [category, radius])

  const getGooglePlace = () => {
    if (category) {
      setLoading(true)

      GlobalApi.getGooglePlace(category, radius, userLocation.lat, userLocation.lng).then(resp => {
        setBusinessList(resp.data.product.results);
        setBusinessListOrg(resp.data.product.results);
        setLoading(false)
      })
    }

  }

  const handleMapClick = (location) => {
    setSelectedLocation(location);
    setShowAddModal(true);
  };

  const onSavePlace = (newPlace) => {
    const spotWithId = { ...newPlace, id: Date.now(), likes: 0 };
    const updatedSpots = [...communitySpots, spotWithId];
    setCommunitySpots(updatedSpots);
    localStorage.setItem('communitySpots', JSON.stringify(updatedSpots));
    setShowAddModal(false);
  };

  const handleLikeSpot = (spotId) => {
    const updatedSpots = communitySpots.map(spot =>
      spot.id === spotId ? { ...spot, likes: (spot.likes || 0) + 1 } : spot
    );
    setCommunitySpots(updatedSpots);
    localStorage.setItem('communitySpots', JSON.stringify(updatedSpots));
  };

  const seedDemoData = () => {
    const demoSpots = [
      { id: 1, name: "Secret Garden Cafe", contributor: "Alice", category: "cafe", location: { lat: userLocation.lat + 0.01, lng: userLocation.lng + 0.01 }, likes: 12, tags: ["Quiet", "Insta-worthy"], description: "Hidden gem with amazing coffee.", addedAt: new Date().toISOString() },
      { id: 2, name: "Skyline Bar", contributor: "Bob", category: "bar", location: { lat: userLocation.lat - 0.01, lng: userLocation.lng - 0.01 }, likes: 8, tags: ["Lively"], description: "Best view in the city!", addedAt: new Date().toISOString() },
      { id: 3, name: "Retro Burger", contributor: "Alice", category: "restaurant", location: { lat: userLocation.lat + 0.015, lng: userLocation.lng - 0.005 }, likes: 5, tags: ["Budget"], description: "Classic 90s vibes.", addedAt: new Date().toISOString() },
    ];
    setCommunitySpots(demoSpots);
    localStorage.setItem('communitySpots', JSON.stringify(demoSpots));
  };

  const onRatingChange = (rating) => {
    if (rating.length == 0) {
      setBusinessList(businessListOrg);
    }
    const result = businessList.filter(item => {
      for (let i = 0; i < rating.length; i++) {
        if (item.rating >= rating[i]) {
          return true;

        }
        return false
      }
    })

    console.log(result)
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 min-h-screen bg-gray-50'>
      <div className='p-5 bg-white shadow-xl z-10'>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800">Explore & Contribute</h2>
          <p className="text-sm text-gray-500">Find places or click the map to add your own!</p>
        </div>

        <CategoryList onCategoryChange={(value) => setCategory(value)} />
        <RangeSelect onRadiusChange={(value) => setRadius(value)} />
        <SelectRating onRatingChange={(value) => onRatingChange(value)} />

        <div className="mt-10 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <h3 className="text-sm font-bold text-blue-800 mb-2">💡 Contribution Mode</h3>
          <p className="text-xs text-blue-600 leading-relaxed mb-4">
            Help the community! Click anywhere on the map to pin a hidden gem that isn't on Google yet.
          </p>
          {communitySpots.length > 0 && (
            <button
              onClick={() => {
                setCommunitySpots([]);
                localStorage.removeItem('communitySpots');
              }}
              className="w-full py-2 bg-white text-red-500 text-xs font-bold rounded-lg border border-red-100 hover:bg-red-50 transition-all font-sans"
            >
              Clear My Contributed Spots
            </button>
          )}
        </div>
        <Leaderboard communitySpots={communitySpots} />

        <button
          onClick={seedDemoData}
          className="mt-4 w-full py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all"
        >
          🚀 Seed Demo Data
        </button>
      </div>

      <div className='col-span-3 pb-20 relative'>
        <GoogleMapView
          businessList={businessList}
          communitySpots={communitySpots}
          onMapClick={handleMapClick}
          onLikeSpot={handleLikeSpot}
        />

        <div className='md:absolute mx-2 w-[90%] md:w-[96%] left-1/2 -translate-x-1/2
           bottom-10 relative md:bottom-5 z-20'>
          {!loading ? <BusinessList businessList={businessList} />
            :
            <div className='flex gap-3'>
              {[1, 2, 3, 4, 5].map((item, index) => (
                <SkeltonLoading key={index} />
              ))}
            </div>
          }
        </div>
      </div>

      {showAddModal && (
        <AddPlaceModal
          location={selectedLocation}
          onSave={onSavePlace}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}
