import React from "react";
import Skeleton from "react-loading-skeleton";

const BlackBogSkeleton = () => {
  const data = [
    { title: "one", price: { vat: 12, total_price: 23 } },
    { title: "two", price: { vat: 14, total_price: 43 } },
    { title: "three", price: { vat: 33, total_price: 54 } },
    { title: "four", price: { vat: 12, total_price: 44 } },
  ];

  // Sort by total_price (creates a new array but nested references remain)
  const sortedByPrice = [...data].sort(
    (a, b) => a.price.total_price - b.price.total_price
  );

  console.log("Sorted Data:", sortedByPrice);
  console.log("Original Data:", data); // The original array order remains unchanged

  // Modify total_price in sorted array
  sortedByPrice[0].price.total_price = 999;

  console.log("After Modification:");
  console.log("Sorted Data:", sortedByPrice);
  console.log("Original Data:", data); // The original data also changes!

  return (
    <div className="">
      <Skeleton className=" h-72" />
    </div>
  );
};

export default BlackBogSkeleton;
