"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ name, coverImage, images }:{ name:string; coverImage?:string|null; images:{url:string; alt?:string|null}[] }){
  const list=[...(coverImage?[{url:coverImage,alt:name}]:[]),...images];
  const [idx,setIdx]=useState(0);
  if(list.length===0) return <div className="aspect-[4/3] rounded-xl border bg-white flex items-center justify-center text-slate-400">Chưa có ảnh</div>;
  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] rounded-xl border bg-white flex items-center justify-center overflow-hidden">
        <Image src={list[idx].url} alt={list[idx].alt||name} width={800} height={600} className="h-full w-auto object-contain"/>
      </div>
      {list.length>1&&(
        <div className="grid grid-cols-5 gap-2">
          {list.map((img,i)=>(
            <button key={i} onClick={()=>setIdx(i)} className={`aspect-square rounded border overflow-hidden ${i===idx?"ring-2 ring-blue-500":""}`}>
              <Image src={img.url} alt={img.alt||name} width={200} height={200} className="h-full w-auto object-contain"/>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
