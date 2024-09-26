import React from "react";

export default function Preferences() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Travel Preferences</h2>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="seat"
            className="block text-sm font-medium text-gray-700"
          >
            Preferred Seat
          </label>
          <select
            id="seat"
            name="seat"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>Window</option>
            <option>Aisle</option>
            <option>Middle</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="meal"
            className="block text-sm font-medium text-gray-700"
          >
            Meal Preference
          </label>
          <select
            id="meal"
            name="meal"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>Standard</option>
            <option>Vegetarian</option>
            <option>Kosher</option>
            <option>Halal</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            id="notifications"
            name="notifications"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="notifications"
            className="ml-2 block text-sm text-gray-900"
          >
            Receive email notifications for deals and offers
          </label>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Preferences
        </button>
      </form>
    </section>
  );
}
