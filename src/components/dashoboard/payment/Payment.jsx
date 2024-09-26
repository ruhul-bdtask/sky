import React from "react";

export default function Payment() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
      <div className="space-y-4">
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Visa ending in 1234</h3>
            <p className="text-sm text-gray-600">Expires 12/2024</p>
          </div>
          <button className="text-red-600 hover:text-red-800">Remove</button>
        </div>
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Mastercard ending in 5678</h3>
            <p className="text-sm text-gray-600">Expires 06/2023</p>
          </div>
          <button className="text-red-600 hover:text-red-800">Remove</button>
        </div>
        <button className="text-indigo-600 hover:text-indigo-800 font-semibold">
          + Add New Payment Method
        </button>
      </div>
    </section>
  );
}
