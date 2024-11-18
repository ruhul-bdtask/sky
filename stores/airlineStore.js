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
        savedFlights: [],
        token: null,
        contactInformation: {},
        passengerInformation: [],
        isOpenSavedDialog: false,
        recentSearchData: [],
        airports: [],
        setAirports: (airport) => set({ airports: airport }),
        setRecentSearchData: (recent) => set({ recentSearchData: recent }),
        setIsOpenSavedDialog: (open = true) => set({ isOpenSavedDialog: open }),
        setPassengerInformation: (info) => set({ passengerInformation: info }),
        setContactInformation: (contact) =>
          set({ contactInformation: contact }),
        setToken: (token) => set({ token: token }),
        setSavedFlights: (saved) => set({ savedFlights: saved }),
        setLegDescription: (leg) => set({ LegDescription: [leg] }),
        setOriginDestinationInformation: (DesInfo) =>
          set({ OriginDestinationInformation: DesInfo }),
        setSelectedFlight: (flight) => set({ selectedFlight: flight }),
        setSearchData: (data) => set({ searchData: data }),
      }),
      {
        name: "airline-storage",
        partialize: (state) => ({
          searchData: state.searchData,
          OriginDestinationInformation: state.OriginDestinationInformation,
          LegDescription: state.LegDescription,
          selectedFlight: state.selectedFlight,
          savedFlights: state.savedFlights,
          token: state.token,
          contactInformation: state.contactInformation,
          passengerInformation: state.passengerInformation,
          isOpenSavedDialog: state.isOpenSavedDialog,
          recentSearchData: state.recentSearchData,
          airports: state.airports,
        }),
      }
    )
  )
);

export default useAirlineStore;
