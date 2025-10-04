import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const sortMap=(s:string)=>{
  switch(s){
    case "oldest": return [{createdAt:"asc"}];
    case "name": return [{name:"asc"}];
    case "featured": return [{isFeatured:"desc"},{createdAt:"desc"}];
    default: return [{createdAt:"desc"}];
  }
};

export async function GET(req: NextRequest){
  const sp=req.nextUrl.searchParams;
  const q=(sp.get("q")||"").trim();
  const cat=(sp.get("cat")||"").trim();
  const sort=sp.get("sort")||"newest";
  const page=Math.max(1, parseInt(sp.get("page")||"1",10));
  const size=Math.max(1, Math.min(48, parseInt(sp.get("size")||"12",10)));

  const where:any={published:true, AND:[] as any[]};
  if(cat) where.AND.push({category:{is:{slug:{equals:cat}}}});
  if(q) where.AND.push({OR:[
    {name:{contains:q,mode:"insensitive"}},
    {short:{contains:q,mode:"insensitive"}},
    {sku:{contains:q,mode:"insensitive"}},
    {category:{is:{name:{contains:q,mode:"insensitive"}}}}
  ]});

  const [total,items]=await Promise.all([
    prisma.product.count({where}),
    prisma.product.findMany({where, orderBy: sortMap(String(sort)), skip:(page-1)*size, take:size,
      include:{category:{select:{name:true,slug:true}}, images:{orderBy:{sort:"asc"}, take:1, select:{url:true,alt:true}}}
    })
  ]);
  return NextResponse.json({page,size,total,items});
}
