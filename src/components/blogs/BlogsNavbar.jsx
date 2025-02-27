"use client";
import { Search } from "lucide-react";
import Link from "next/link";

export default function BlogsNavbar() {
  return (
    <div>
      <div className="bg-[#F0F3F5] flex justify-between px-5">
        <div className="">
          <ul className="flex items-center gap-7 p-4 cursor-pointer">
            <Link href="/travel-blog">Home</Link>

            <Link href="/blog/travel-recommendations">
              Travel recommendations
            </Link>
            <Link href="/blog/the-taste-of-travel">The taste of travel</Link>
            <Link href="/blog/tips-and-tricks">Tips & tricks</Link>

            <Link href="/blog/travel-experience">Travel Experience</Link>
            <Link href="/blog/news">News</Link>
          </ul>
        </div>
        {/* <div className="flex items-center gap-2">
          <span className="text-[13px]">Search articles and guides</span>
          <Search className="w-5" />
        </div> */}
      </div>
    </div>
  );
}
