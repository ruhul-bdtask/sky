"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";

export default function ResultPageSkeleton() {
  return (
    <div className="container_search max-w-5xl mx-auto p-4 flex flex-row gap-4">
      {/* Left Sidebar with Filters */}
      <aside className="hidden md:block w-64 space-y-4">
        <section
          aria-label="Advice"
          className="bg-white p-4 rounded-lg shadow-sm"
        >
          <div className="space-y-2">
            <Skeleton width={100} height={24} />
            <Skeleton width={120} height={16} />
            <Skeleton width={180} height={16} />
          </div>
        </section>

        <section
          aria-label="Filters"
          className="bg-white p-4 rounded-lg shadow-sm"
        >
          <div className="space-y-4">
            {["Stops", "Times", "Airlines"].map((filter) => (
              <div key={filter} className="space-y-2">
                <Skeleton width={80} height={20} />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton circle width={16} height={16} />
                    <Skeleton width={100} height={16} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-4">
        {/* Filter Options */}
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <section
              key={i}
              aria-label={`Filter option ${i + 1}`}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="space-y-2">
                <Skeleton width={80} height={16} />
                <div className="flex items-center gap-2">
                  <Skeleton width={64} height={24} />
                  <Skeleton width={64} height={16} />
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Flight Cards */}
        {[...Array(3)].map((_, i) => (
          <article key={i} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-row justify-between gap-4 flex-wrap">
              <div className="flex-1 space-y-4">
                {/* Tags */}
                <div className="flex gap-2">
                  <Skeleton width={64} height={24} borderRadius={9999} />
                  <Skeleton width={64} height={24} borderRadius={9999} />
                </div>

                {/* Flight Details */}
                <div className="flex items-center gap-4">
                  <Skeleton circle width={40} height={40} />
                  <div className="space-y-2 flex-1">
                    <Skeleton width={128} height={24} />
                    <Skeleton width={96} height={16} />
                  </div>
                </div>

                {/* Airline Info */}
                <div className="space-y-2">
                  <Skeleton width={160} height={16} />
                  <Skeleton width={96} height={16} />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex flex-col gap-4 items-end">
                <div className="flex gap-2">
                  <Skeleton circle width={32} height={32} />
                  <Skeleton circle width={32} height={32} />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton width={128} height={32} />
                  <Skeleton width={96} height={16} />
                  <Skeleton width={112} height={40} borderRadius={6} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
