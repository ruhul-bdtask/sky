import React from "react";

export default function Travelers() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Saved Travelers</h2>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">John Doe</h3>
          <p className="text-sm text-gray-600">Passport: AB1234567</p>
          <p className="text-sm text-gray-600">DOB: 01/01/1980</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">Jane Doe</h3>
          <p className="text-sm text-gray-600">Passport: CD7654321</p>
          <p className="text-sm text-gray-600">DOB: 15/05/1985</p>
        </div>
        <button className="text-indigo-600 hover:text-indigo-800 font-semibold">
          + Add New Traveler
        </button>
      </div>
    </section>
  );
}
