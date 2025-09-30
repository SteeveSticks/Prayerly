import React from "react";

const PrayerExample = () => {
  return (
    <div className="px-14 py-14 text-white ">
      <div className="flex items-center justify-center gap-6 bg-gray-500 p-6 rounded-md">
        <div>
          <p>
            <h1 className="text-2xl font-bold mb-2">
              JOIN US IN PRAYER AND COMMUNITY
            </h1>
            <span className="text-sm ">
              Prayerly is a community of faithful people who are committed to
              sharing their prayers and supporting each other in our journey.
            </span>
          </p>
        </div>

        <div>
          <video
            src="/video/prayerly.mp4"
            controls
            loop
            autoPlay
            className="w-full rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default PrayerExample;
