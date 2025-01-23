import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useAirlineStore = create()(
  devtools(
    persist(
      (set, get) => ({
        selectedFlight: {},
        OriginDestinationInformation: [],
        LegDescription: {},
        searchData: {},
        savedTrips: [],
        selectedSavedTrip: {},
        isChangeTrip: false,
        isCreateTrip: false,
        token: null,
        contactInformation: {},
        passengerInformation: [],
        isOpenSavedDialog: false,
        recentSearchData: [],
        airports: [],
        airlines: [],
        filterOptions: {
          stops: [],
          takeOffRange: [0, 100],
          landingRange: [0, 100],
          airlines: [],
          airports: [],
          legRange: [0, 100], // in minutes
          layoverRange: [0, 100], // in minutes
        },
        filterData: [],
        setFilterData: (newData) => set({ filterData: newData }),
        minPrice: 0,
        maxPrice: Infinity,
        userData: {},
        originQuery: "",
        originAirportName: "",
        destinationAirportName: "",
        destinationQuery: "",
        travelPlanningDate: "",
        savedSingleFlight: {},
        setSavedSingleFlight: (flight) => set({ savedSingleFlight: flight }),
        setTravelPlanningDate: (plan) => set({ travelPlanningDate: plan }),
        setDestinationQuery: (des) => set({ destinationQuery: des }),
        setDestinationAirportName: (des) =>
          set({ destinationAirportName: des }),
        setOriginQuery: (origin) => set({ originQuery: origin }),
        setOriginAirportName: (origin) => set({ originAirportName: origin }),
        setUserData: (user) => set({ userData: user }),
        setMinPrice: (min) => set({ minPrice: min }),
        setMaxPrice: (max) => set({ maxPrice: max }),
        setAirports: (airports) => set({ airports: airports }),
        setAirlines: (airlines) => set({ airlines: airlines }),
        setFilterOptions: (newOptions) =>
          set((state) => ({
            filterOptions: { ...state.filterOptions, ...newOptions },
          })),
        setRecentSearchData: (recent) => set({ recentSearchData: recent }),
        setIsOpenSavedDialog: (open = true) => set({ isOpenSavedDialog: open }),
        setPassengerInformation: (info) => set({ passengerInformation: info }),
        setContactInformation: (contact) =>
          set({ contactInformation: contact }),
        setToken: (token) => set({ token: token }),
        setSavedTrips: (saved) => set({ savedTrips: saved }),
        setLegDescription: (leg) => set({ LegDescription: [leg] }),
        setOriginDestinationInformation: (DesInfo) =>
          set({ OriginDestinationInformation: DesInfo }),
        setSelectedFlight: (flight) => set({ selectedFlight: flight }),
        setSelectedSavedTrip: (trip) => set({ selectedSavedTrip: trip }),
        setIsChangeTrip: (status) => set({ isChangeTrip: status }),
        setIsCreateTrip: (status) => set({ isCreateTrip: status }),
        setSearchData: (data) => set({ searchData: data }),

        timeLeft: loadTimeFromLocalStorage(),
        intervalId: null,
        isRunning: false,

        startCountdown: () => {
          if (get().intervalId) return; // Prevent multiple intervals

          set({ isRunning: true });

          const interval = setInterval(() => {
            const timeLeft = get().timeLeft;
            if (timeLeft > 0) {
              const newTimeLeft = timeLeft - 1;
              set({ timeLeft: newTimeLeft });
              saveTimeToLocalStorage(newTimeLeft);
            } else {
              clearInterval(get().intervalId);
              set({ intervalId: null, isRunning: false });
              saveTimeToLocalStorage(0); // Timer stops when it reaches 0
            }
          }, 1000);

          set({ intervalId: interval });
        },

        resetTime: () => {
          set({ timeLeft: 1800, intervalId: null, isRunning: false });
          saveTimeToLocalStorage(1800); // Reset to 30 minutes when reset is called
        },

        stopCountdown: () => {
          if (get().intervalId) {
            clearInterval(get().intervalId);
            set({ intervalId: null, isRunning: false });
          }
        },
      }),
      {
        name: "airline-storage",
        partialize: (state) => ({
          searchData: state.searchData,
          OriginDestinationInformation: state.OriginDestinationInformation,
          LegDescription: state.LegDescription,
          selectedFlight: state.selectedFlight,
          savedTrips: state.savedTrips,
          selectedSavedTrip: state.selectedSavedTrip,
          token: state.token,
          contactInformation: state.contactInformation,
          passengerInformation: state.passengerInformation,
          isOpenSavedDialog: state.isOpenSavedDialog,
          recentSearchData: state.recentSearchData,
          airports: state.airports,
          minPrice: state.minPrice,
          maxPrice: state.maxPrice,
          userData: state.userData,
          originQuery: state.originQuery,
          destinationQuery: state.destinationQuery,
          travelPlanningDate: state.travelPlanningDate,
          originAirportName: state.originAirportName,
          destinationAirportName: state.destinationAirportName,
          savedSingleFlight: state.savedSingleFlight,
        }),
      }
    )
  )
);

function saveTimeToLocalStorage(timeLeft) {
  if (typeof window !== "undefined") {
    localStorage.setItem("timeLeft", timeLeft);
  }
}

function loadTimeFromLocalStorage() {
  if (typeof window !== "undefined") {
    const storedTime = localStorage.getItem("timeLeft");
    // If storedTime is valid and not expired (i.e., not 0), return it
    if (storedTime && !isNaN(storedTime)) {
      const time = parseInt(storedTime, 10);
      return time > 0 ? time : 0; // If timeLeft is 0, keep it as 0
    }
    // If no valid time is stored, return default (30 minutes)
    return 1800;
  }
  return 1800;
}

export default useAirlineStore;
