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
        airlines: [],
        filterOptions: {
          stops: [],
          takeOffRange: [0, 24],
          landingRange: [0, 72],
          airlines: [],
          airports: [],
          legRange: [0, 1000], // in minutes
          stopOverRange: [0, 1000], // in minutes
        },
        minPrice: 0,
        maxPrice: Infinity,
        userData: {},
        originQuery: "",
        originAirportName: "",
        destinationAirportName: "",
        destinationQuery: "",
        travelPlanningDate: "",
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
        setFilterOptions: (filterOptions) =>
          set({ filterOptions: { ...filterOptions } }),
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
          originQuery: state.originQuery,
          destinationQuery: state.destinationQuery,
          travelPlanningDate: state.travelPlanningDate,
          originAirportName: state.originAirportName,
          destinationAirportName: state.destinationAirportName,
        }),
      }
    )
  )
);

export default useAirlineStore;
