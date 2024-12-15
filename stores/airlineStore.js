import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useAirlineStore = create()(
  devtools(
    persist(
      (set) => ({
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
        minPrice: 0,
        maxPrice: Infinity,
        userData: {},
        setUserData: (user) => set({ userData: user }),
        setMinPrice: (min) => set({ minPrice: min }),
        setMaxPrice: (max) => set({ maxPrice: max }),
        setAirports: (airport) => set({ airports: airport }),
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
        }),
      }
    )
  )
);

export default useAirlineStore;
