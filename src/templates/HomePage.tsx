
"use client";

import React, { useState } from "react";
import Image from "next/image";

import { useAuth } from "@/utils/AuthContext"; 
import { BlogListingPanel } from "@/templates/BlogListingPanel";

const WebsiteCard = ({ title, imageUrl,description, onClick }: { title: string,imageUrl: string, description: string, onClick: () => void }) => (
  <div onClick={onClick} className="w-80 h-60 p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition duration-300 cursor-pointer flex flex-col justify-center text-center">
    <div className="relative h-48 w-full">
                        <Image
                          src={`${imageUrl}`}
                          alt="Blog Cover"
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          unoptimized
                        />
                      </div>
    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{title}</h5>
    <p className="font-normal text-gray-700">{description}</p>
  </div>
);


const HomePage = () => {
  const { userRole, loading } = useAuth();
  const [selectedWebsite, setSelectedWebsite] = useState<'omlogistics' | 'sanjvik' | null>(null);

  if (selectedWebsite) {
    return (
      <BlogListingPanel 
        website={selectedWebsite} 
        onBack={() => setSelectedWebsite(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        {/* <Navbar /> */}
        <div className="flex-grow flex items-center justify-center m-8 p-8 h-96">
          <p className="text-xl">Loading website options...</p>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }


  const showSanjvik = userRole === 'sanjvikAdmin' || userRole === 'SuperAdmin';
  const showOMLogistics = userRole === 'olscAdmin' || userRole === 'SuperAdmin';


  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* <Navbar /> */}
      <div className="flex-grow flex items-center justify-center p-8  h-96">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          
          {showSanjvik && (
            <WebsiteCard
              title="Sanjvik Panel"
              imageUrl='/assets/Sanjvik.png'
              description="Manage content for the Sanjvik website."
              onClick={() => setSelectedWebsite('sanjvik')}
            />
          )}

          {showOMLogistics && (
            <WebsiteCard
              title="OM Logistics Panel"
              imageUrl="/assets/Om.png"
              description="Manage content for the OMLogistics website."
              onClick={() => setSelectedWebsite('omlogistics')}
            />
          )}

          {userRole && !showSanjvik && !showOMLogistics && (
            <h1 className="text-xl text-center col-span-2">
              You do not have permission to access any panels.
            </h1>
          )}
          {!userRole && (
            <h1 className="text-xl text-center col-span-2">
              Please log in to view website options.
            </h1>
          )}
          
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export { HomePage };