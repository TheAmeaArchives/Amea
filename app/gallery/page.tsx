import React from "react";
import { createClient } from "@/lib/supabase/server";
import type { GalleryItem } from "@/lib/types";

const Gallery = async () => {
  const supabase = createClient();
  const { data: items } = await supabase
    .from("gallery_items")
    .select("*")
    .order("order_index", { ascending: true });

  const hasItems = items && items.length > 0;

  return (
    <div className="flex flex-col gap-10 ">
      <div className="akira text-5xl">
        <h1>Grand</h1>
        <h1>Gallery</h1>
      </div>
      <div className="h-[500px] bg-default center">
        {/* <h1 className="text-4xl font-bold">The Grand Gallery</h1> */}
      </div>
      <div className="h-screen center ">
        <h1 className="text-[32px] max-md:text-xl font-normal text-center">
          Display of projects built & impact <br /> created using our insights.
        </h1>
      </div>
      <div className="h- center ">
        <div className="h-full w-full md:grid md:grid-cols-3 md:gap-4 max-md:space-y-11 p-5">
          {hasItems ? (
            (items as GalleryItem[]).map((item) => (
              <div className="flex flex-col gap-3" key={item.id}>
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-56 rounded-lg object-cover"
                  />
                ) : (
                  <div className="bg-default w-full h-56 rounded-lg" />
                )}
                <div>
                  <h1 className="text-xl font-medium">{item.title}</h1>
                  <p className="text-sm text-black/70">{item.description ?? ""}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
              <p className="text-xl text-gray-500 aileron">No gallery items yet.</p>
              <p className="text-sm text-gray-400 mt-2">Check back soon for new projects.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
