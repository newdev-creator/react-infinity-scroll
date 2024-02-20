import React from "react";
import { useState, useEffect, useRef } from "react";

import usePhotos from "../hooks/usePhotos";
import spinner from "../assets/spinner.svg";

export default function List() {
  const [query, setQuery] = useState("random");
  const [pageNumber, setPageNumber] = useState(1);
  const lastPicRef = useRef();
  const photoApiData = usePhotos(query, pageNumber);

  console.log(photoApiData);

  useEffect(() => {
    if (lastPicRef.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && photoApiData.maxPages !== pageNumber) {
          setPageNumber(pageNumber + 1);
          lastPicRef.current = null;
          observer.disconnect();
        }
      });

      observer.observe(lastPicRef.current);
    }
  }, [photoApiData]);

  return (
    <>
      <h1 className="text-4xl">Unsplash Clone.</h1>
      <form>
        <label className="block mb-4" htmlFor="search">
          Look for images...
        </label>
        <input
          className="block w-full mb-14 text-slate-800 py-3 px-2 text-md outline-gray-500 rounded border border-slate-400"
          placeholder="Look for something..."
          type="text"
        />
      </form>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,_1fr))] auto-rows-[175px] gap-4 justify-center">
        {!photoApiData.loader &&
          photoApiData.photos.length !== 0 &&
          photoApiData.photos.map((photo, index) => {
            if (photoApiData.photos.length === index + 1) {
              return (
                <li ref={lastPicRef} key={photo.id}>
                  <img
                    className="w-full h-full object-cover border-4 border-red-500"
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                  />
                </li>
              );
            } else {
              return (
                <li key={photo.id}>
                  <img
                    className="w-full h-full object-cover"
                    src={photo.urls.regular}
                    alt={photo.alt_description}
                  />
                </li>
              );
            }
          })}
      </ul>

      {/* Loader */}
      {photoApiData.lodaing && !photoApiData.error.data && (
        <img className="block mx-auto" src={spinner} />
      )}
    </>
  );
}
