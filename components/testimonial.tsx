"use client";
import React from "react";
import X_Logo from "../public/X.png";
import Image from "next/image";
import { Marquee } from "./magicui/marquee";
import { ClientTweetCard } from "./magicui/client-tweet-card";

const Testimonial = () => {
  const tweetIds = [
    "1950945541610754379", // quote without image
    "1950968793284616412",
    "1951272815849591093",
    "1950974917597368410",
    // "1950944930622308582", // quote without image
    "1951383719068987495",
    "1950944323589087631",
  ];

  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Image src={X_Logo} alt="X Logo" className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-gray-900">
            What People Are Saying
          </h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See what the community is saying about Drawwy and the amazing artwork
          being created.
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-marquee space-x-6">
          <Marquee>
            {tweetIds.map((tweetId, index) => (
              <div key={`first-${index}`} className="flex-shrink-0 w-80">
                <ClientTweetCard
                  id={tweetId}
                  className="h-full bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-shadow duration-300"
                />
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
