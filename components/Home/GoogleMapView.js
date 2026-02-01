import { GoogleMap, InfoWindowF, LoadScript, MarkerF } from '@react-google-maps/api'
import React, { useContext, useEffect, useState } from 'react'
import Markers from './Markers'
import { SelectedBusinessContext } from '@/context/SelectedBusinessContext'
import { UserLocationContext } from '@/context/UserLocationContext'

function GoogleMapView({ businessList, communitySpots, onMapClick, onLikeSpot }) {
  const { userLocation, setUserLocation } = useContext(UserLocationContext)
  const { selectedBusiness, setSelectedBusiness } = useContext(SelectedBusinessContext)
  const [map, setMap] = useState();
  const [selectedCommunitySpot, setSelectedCommunitySpot] = useState(null);

  const containerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '15px'
  }

  useEffect(() => {
    // Keep internal selected spot state in sync if it gets updated (e.g. likes)
    if (selectedCommunitySpot) {
      const updated = communitySpots.find(s => s.id === selectedCommunitySpot.id);
      if (updated) setSelectedCommunitySpot(updated);
    }
  }, [communitySpots]);

  return (
    <div className='overflow-hidden rounded-2xl shadow-lg border border-gray-100'>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        mapIds={['327f00d9bd231a33']}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={
            !selectedBusiness.name ? userLocation : selectedBusiness.geometry.location
          }
          options={{
            mapId: '327f00d9bd231a33',
            disableDefaultUI: true,
            zoomControl: true,
          }}
          zoom={13}
          onLoad={map => setMap(map)}
          onClick={(e) => onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
        >
          <MarkerF
            position={userLocation}
            icon={{
              url: '/user-location.png',
              scaledSize: {
                width: 50,
                height: 50
              }
            }}
          />

          {/* Google Places Markers */}
          {businessList.map((item, index) => index <= 7 && (
            <Markers business={item} key={index} />
          ))}

          {/* Community Markers */}
          {communitySpots?.map((spot, index) => (
            <MarkerF
              key={'community-' + index}
              position={spot.location}
              onClick={() => setSelectedCommunitySpot(spot)}
              icon={{
                url: spot.category === 'restaurant' ? '/hamburger.png' :
                  spot.category === 'cafe' ? '/bento.png' :
                    spot.category === 'bar' ? '/pizza.png' : '/circle.png',
                scaledSize: { width: 35, height: 35 }
              }}
              title={spot.name}
            />
          ))}

          {selectedCommunitySpot && (
            <InfoWindowF
              position={selectedCommunitySpot.location}
              onCloseClick={() => setSelectedCommunitySpot(null)}
            >
              <div className="p-3 min-w-[220px]">
                <div className="flex justify-between items-start border-b pb-2 mb-2">
                  <h3 className="font-black text-gray-900 leading-tight">{selectedCommunitySpot.name}</h3>
                  <button
                    onClick={() => onLikeSpot(selectedCommunitySpot.id)}
                    className="flex flex-col items-center group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 group-active:scale-150 transition-transform cursor-pointer">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                    <span className="text-[10px] font-bold text-red-600">{selectedCommunitySpot.likes || 0}</span>
                  </button>
                </div>

                <p className="text-xs text-gray-600 mb-3 italic leading-relaxed">"{selectedCommunitySpot.description}"</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedCommunitySpot.tags?.map(tag => (
                    <span key={tag} className="text-[9px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="text-[10px] text-gray-400 flex justify-between items-center bg-gray-50 -mx-3 -mb-3 p-2 rounded-b-lg border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-[8px] flex items-center justify-center text-blue-600 font-bold">
                      {selectedCommunitySpot.contributor?.charAt(0)}
                    </div>
                    <span className="font-medium">Explorer: {selectedCommunitySpot.contributor}</span>
                  </div>
                  <span className="opacity-70">{new Date(selectedCommunitySpot.addedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default GoogleMapView