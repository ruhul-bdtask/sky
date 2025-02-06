"use client";
import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function BlogHeader() {
  return (
    <div>
      <div className="bg-[#F0F3F5] flex justify-between px-5">
        <div className="">
          <ul className="flex items-center gap-7 p-4 cursor-pointer">
            <Link href="/travel-blog">Home</Link>

            <Link href="/blog/travel-recommended">Travel recommendations</Link>
            <Link href="/blog/the-taste-of-travel">The taste of travel</Link>
            <Link href="/blog/tips-tricks">Tips & tricks</Link>

            <Link href="/blog/travel-experience">Travel Experience</Link>
            <Link href="/blog/news">News</Link>
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[13px]">Search articles and guides</span>
          <Search className="w-5" />
        </div>
      </div>
    </div>
  );
}
