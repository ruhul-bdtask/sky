"use client";
import "./TicketPage.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
import useAirlineStore from "../../../stores/airlineStore";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@/utils/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { formatMinutesToHours } from "@/lib/formatMinutesToHours";
import Loading from "../loader/Loading";
const TicketCopy = ({ searchParams, authToken }) => {
  const [buffer, setBuffer] = useState(true);
  const contentRef = useRef(null);

  const printFn = useReactToPrint({
    contentRef: contentRef,
    documentTitle: "Invoice",
  });

  const handlePrint = useCallback(() => {
    printFn();
  }, [printFn]);

  const router = useRouter();
  const { token, setToken, savedTrips, setSavedTrips, setSelectedSavedTrip } =
    useAirlineStore();
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [slack, setSlack] = useState("");

  useEffect(() => {
    const checkAuth = () => {
      const authToken = Cookies.get("auth-token");

      if (!authToken) {
        Cookies.remove("auth-token");
        setToken(null);
        if (savedTrips?.length > 0 && savedTrips[0]?.id) {
          setSavedTrips([]);
          setSelectedSavedTrip({});
        }
        router.push("/login");
        return;
      }
    };

    checkAuth();
  }, [token]);

  const payload = {
    tran_id: searchParams.slack,
  };

  const {
    data: bookingData,
    error: bookingError,
    isLoading: bookingLoading = true,
    refetch: refetchBookingData,
  } = useQuery({
    queryKey: ["reservation-info", payload],
    queryFn: () => fetchData("/gds/reservation-info", "POST", payload, null),
    enabled: false,
  });

  useEffect(() => {
    if (token) {
      refetchBookingData();
    }
  }, [token]);

  useEffect(() => {
    if (bookingData) {
      setLoading(false);
    }
  }, [bookingData]);

  // if (loading) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-[#FF6810] z-50">
  //       <img
  //         src={"/ticketing.gif"}
  //         alt="Loading..."
  //         className="w-48 md:w-64 h-full object-contain"
  //       />
  //     </div>
  //   );
  // }

  if (bookingData?.success == false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>
          <p className="text-center text-red-500">
            {bookingData?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Loading loading={loading} />
      <div
        className="body0container"
        style={{
          padding: "40px 0",
          fontSize: "15px",
          backgroundColor: "#f7f7f7",
          fontFamily: "Poppins",
          fontWeight: "400",
          lineHeight: "1.5",
          color: "#212529",
          textAlign: "left",
        }}
      >
        <div
          className="main0container"
          style={{
            width: "100%",
            paddingRight: "17px",
            paddingLeft: "15px",
            marginRight: "auto",
            maxWidth: "950px",
            marginLeft: "auto",
          }}
        >
          <div style={{ justifyContent: "center" }}>
            <div
              style={{
                paddingRight: "15px",
                paddingLeft: "15px",
              }}
            >
              <div style={{ textAlign: "right" }}>
                <button
                  style={{
                    color: "#fff",
                    backgroundColor: "#FC660F",
                    textDecoration: "none",
                    borderColor: "#FC660F",
                    marginBottom: "1rem",
                    display: "inline-block",
                    border: "1px solid transparent",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.25rem",
                    boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
                    fontSize: "1rem",
                  }}
                  onClick={handlePrint}
                >
                  <i class="flaticon2-printer"></i>
                  Print PDF
                </button>
              </div>
              <div className="wrapper_">
                <div
                  className="invoice-wrap"
                  id="printable-content"
                  ref={contentRef}
                >
                  <div style={{ marginBottom: "1.5 rem" }}>
                    <div>
                      <img
                        src="data:image/png;base64,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"
                        class="invoice-logo"
                        alt="hello"
                      />
                    </div>
                  </div>
                  <h4
                    style={{
                      paddingBottom: "1px",
                      paddingTop: "0.5 rem",
                      marginBottom: "6px",
                      borderBottom: "2px solid #dee2e6",
                      borderColor: "#333",
                      fontSize: "18px",
                      fontWeight: "600",
                      lineHeight: "1.2",
                      marginTop: "0",
                    }}
                  >
                    <span
                      style={{
                        marginRight: "1rem",
                        textTransform: "uppercase",
                      }}
                    >
                      {bookingData?.data?.journey_start}

                      <small
                        style={{
                          marginRight: "2px",
                          marginLeft: "5px",
                        }}
                      >
                        <i
                          class="fa fa-caret-right"
                          style={{ fontSize: "20px" }}
                        ></i>
                      </small>
                      {bookingData?.data?.journey_end}
                    </span>
                    TRIP TO
                    <span
                      style={{
                        marginLeft: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      {bookingData?.data?.last_airport}
                    </span>
                    {","}
                    <span
                      style={{
                        marginLeft: "12px",
                        textTransform: "uppercase",
                      }}
                    >
                      {bookingData?.data?.flights_info[0].airline_details}
                    </span>
                  </h4>
                  <div
                    style={{
                      marginRight: "-15px",
                      marginLeft: "-15px",
                      marginBottom: "15px",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        paddingLeft: "15px",
                        maxWidth: "50%",
                        flex: "0 0 50%",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          color: "#3c3c3c",
                          fontWeight: "400",
                        }}
                      >
                        PREPARED FOR
                      </div>
                      {bookingData?.data?.pxn_list !== undefined &&
                        bookingData?.data?.pxn_list.map((pxn, index) => (
                          <div
                            key={index}
                            style={{
                              fontWeight: "600",
                              fontSize: "19px",
                              color: "#3a3a3a",
                              lineHeight: "22px",
                            }}
                          >
                            {pxn.pxn_name}
                          </div>
                        ))}
                    </div>

                    <div
                      style={{
                        fontWeight: "500",
                        textTransform: "uppercase",
                        fontSize: "13px",
                        color: "#464646",
                      }}
                    >
                      Travel Consultant — Ticketing
                    </div>
                  </div>
                  <div
                    style={{
                      marginRight: "0",
                      marginLeft: "0",
                      paddingBottom: "0",
                      marginBottom: "0",
                      borderBottom: "2px solid #dee2e6",
                      borderColor: "#333",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        paddingRight: "0",
                        paddingLeft: "0",
                        flex: "0 0 66.666667%",
                        maxWidth: "66.666667%",
                      }}
                    >
                      <div style={{ lineHeight: "15px" }}>
                        RESERVATION CODE : {bookingData?.data?.reservation_code}
                      </div>
                      <div style={{ lineHeight: "20px" }}>
                        AIRLINE PNR : {bookingData?.data?.airline_pnr}
                      </div>
                    </div>
                    <div
                      style={{
                        paddingRight: "0",
                        paddingLeft: "0",
                        flex: "0 0 66.66667%",
                      }}
                    ></div>
                  </div>

                  {bookingData?.data?.flights_info &&
                    bookingData?.data?.flights_info.map((inf) => (
                      <>
                        <div
                          style={{
                            marginBottom: "1rem",
                            marginTop: "1rem",
                            display: "flex",
                            alignItems: "center",
                            marginRight: "-15px",
                            marginLeft: "-15px",
                          }}
                        >
                          <div
                            style={{
                              display: "0 0 50%",
                              paddingLeft: "15px",
                              maxWidth: "45%",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "left",
                              }}
                            >
                              <i
                                className="fa fa-plane fa-6"
                                style={{
                                  fontSize: "40px",
                                  color: "#3a3a3a",
                                }}
                                aria-hidden="true"
                              ></i>
                              <span
                                style={{
                                  marginLeft: "0.5rem",
                                  textTransform: "uppercase",
                                  paddingTop: "12px",
                                }}
                              >
                                DEPARTURE: {inf.departure_date}
                              </span>
                            </div>
                          </div>
                          <div
                            style={{
                              paddingLeft: "5px",
                              paddingTop: "12px",
                              paddingRight: "15px",
                              flex: "0 0 50%",
                              maxWidth: "55%",
                              flexDirection: "flex-end",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "200",
                                fontSize: "small",
                                color: "#f14040",
                              }}
                            >
                              Please verify flight times prior to departure
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            marginBottom: "0.5rem",
                            marginRight: "0",
                            display: "flex",
                            marginLeft: "0",
                          }}
                        >
                          <div
                            style={{
                              maxWidth: "25%",
                              flex: "0 0 25%",
                              backgroundColor: "#e7e7e9",
                              padding: "10px",
                              borderBottomLeftRadius: "30px",
                              paddingLeft: "16px",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "500",
                                lineHeight: "15px",
                              }}
                            >
                              {inf.airline_details}
                            </div>
                            <div
                              style={{
                                fontWeight: "700",
                                marginBottom: "3px",
                              }}
                            >
                              {inf.airline_code} {inf.flight_number}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                fontWeight: "400px",
                                paddingTop: "3px",
                                lineHeight: "11px",
                              }}
                            >
                              Duration:
                            </div>
                            <div
                              style={{
                                fontWeight: "400",
                                marginBottom: "4px",
                                fontSize: "12px",
                              }}
                            >
                              {formatMinutesToHours(inf.duration_minutes)}
                            </div>
                            <div
                              style={{
                                fontSize: "12px",
                                lineHeight: "10px",
                                paddingTop: "6px",
                              }}
                            >
                              Cabin:
                            </div>
                            <div
                              style={{
                                fontWeight: "400",
                                fontSize: "12px",
                                textTransform: "lowercase",
                                paddingBottom: "5px",
                              }}
                            >
                              {inf.cabin_class}
                            </div>
                            {/* <div style={{ fontSize: "12px" }}>
                            Status:
                          </div>
                          <div
                            style={{
                              fontWeight: "300",
                              fontSize: "12px",
                              lineHeight: "11px",
                            }}
                          >
                            Confirmed
                          </div> */}
                          </div>

                          <div
                            style={{
                              overflow: "hidden",
                              textAlign: "center",
                              paddingRight: "0",
                              paddingLeft: "0",
                              border: "1px solid #dee2e6",
                              borderColor: "#707070",
                              flex: "0 0 50%",
                              maxWidth: "50%",
                            }}
                          >
                            <div
                              style={{
                                paddingLeft: "0.5rem",
                                paddingRight: ".5rem",
                                paddingBottom: ".5rem",
                                alignItems: "center",

                                marginRight: "0",
                                marginLeft: "0",
                                display: "flex",
                              }}
                            >
                              <div
                                style={{
                                  paddingRight: "0",
                                  textAlign: "left",
                                  paddingLeft: "0px",
                                  paddingTop: "9px",
                                  flexBasis: 0,
                                  flexGrow: "1",
                                  minWidth: 0,
                                  maxWidth: "100%",
                                }}
                              >
                                <h4
                                  style={{
                                    lineHeight: "1",
                                    fontSize: "19px",
                                    fontWeight: "500",
                                    color: "#5d5d5d",
                                    marginBottom: "0",
                                    marginTop: "0",
                                  }}
                                >
                                  {inf.from_airport}
                                </h4>
                                <div
                                  style={{
                                    textTransform: "uppercase",
                                    fontSize: "13px",
                                  }}
                                >
                                  {inf.from_location}
                                </div>
                              </div>
                              <i
                                className="fas fa-caret-right"
                                style={{ marginLeft: "10px" }}
                              ></i>
                              <div
                                style={{
                                  paddingRight: "0",
                                  paddingLeft: "0",
                                  flexBasis: "0",
                                  paddingTop: "9px",
                                  flexGrow: "1",
                                  minWidth: "0",
                                  maxWidth: "100%",
                                  textAlign: "center",
                                }}
                              >
                                <h4
                                  style={{
                                    lineHeight: "1",
                                    fontSize: "19px",
                                    fontWeight: "500",
                                    color: "#5d5d5d",
                                    marginBottom: "0",
                                    marginTop: "0",
                                  }}
                                >
                                  {inf.to_airport}
                                </h4>
                                <div
                                  style={{
                                    textTransform: "uppercase",
                                    fontSize: "13px",
                                  }}
                                >
                                  {inf.to_location}
                                </div>
                              </div>
                            </div>
                            <div
                              style={{
                                height: "100%",
                                textAlign: "center",
                                justifyContent: "space-between",
                                borderTop: "1px solid #dee2e6",
                                borderColor: "#707070",
                                marginRight: 0,
                                marginLeft: 0,
                                display: "flex",
                              }}
                            >
                              <div
                                style={{
                                  paddingLeft: "9px",
                                  paddingRight: "1rem",
                                  paddingTop: ".5rem",
                                  borderRight: "1px solid #dee2e6",
                                  borderColor: "#707070",
                                  flexBasis: "0",
                                  flexGrow: "1",
                                  minWidth: "0",
                                  maxWidth: "100%",
                                  textAlign: "left",
                                  lineHeight: "18px",
                                }}
                              >
                                Departing At : <br />
                                <span style={{ fontSize: "12px" }}>
                                  {inf.departure_date}
                                </span>
                                <br />
                                <strong
                                  style={{
                                    textTransform: "lowercase",
                                  }}
                                >
                                  {inf.departure_time} (Local time)
                                </strong>
                              </div>

                              <div
                                style={{
                                  paddingLeft: "9px",
                                  paddingRight: "1rem",
                                  paddingTop: ".5rem",
                                  // borderRight: '1px solid #dee2e6',
                                  // borderColor: '#707070',
                                  flexBasis: "0",
                                  flexGrow: "1",
                                  minWidth: "0",
                                  maxWidth: "100%",
                                  textAlign: "left",
                                  lineHeight: "18px",
                                }}
                              >
                                Arrival At : <br />
                                <span style={{ fontSize: "12px" }}>
                                  {inf.arrival_date}
                                </span>
                                <br />
                                <strong
                                  style={{
                                    textTransform: "lowercase",
                                  }}
                                >
                                  {inf.arrival_time} (Local time)
                                </strong>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              borderBottom: "1px solid #dee2e6",
                              borderRight: "1px solid #dee2e6",
                              borderTop: "1px solid #dee2e6",
                              borderColor: "#707070",
                              flex: "0 0 25%",
                              maxWidth: "25%",
                              paddingTop: "4px",
                              paddingLeft: "8px",
                              lineHeight: "17px",
                            }}
                          >
                            <div style={{ marginBottom: "0.5 rem" }}>
                              Aircraft :<br />
                              {inf.aircraft_type_name}
                            </div>
                            <div style={{ marginBottom: "0.5 rem" }}>
                              Distance(Miles):
                              <br />
                              {inf.distance_miles}
                            </div>
                            <div style={{ marginBottom: "0.5rem" }}>
                              Meals: {inf.meals ? inf.meals : "N/A"}
                            </div>
                          </div>
                        </div>
                        {/* {bookingData?.data?.baggage_info.map(bagInf)} */}
                        <div
                          style={{
                            marginBottom: "13px",
                            display: "flex",
                            marginTop: "11px",
                            marginRight: "-15px",
                            marginLeft: "-15px",
                          }}
                        >
                          <div
                            style={{
                              flex: "0 0 100%",
                              maxWidth: "100%",
                              paddingRight: "15px",
                              paddingLeft: "15px",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "400",
                                fontSize: "12px",
                                lineHeight: "15px",
                              }}
                            >
                              Checked Baggage (Kg): Adult,
                              {
                                bookingData?.data?.baggage_info[0]
                                  .checked_weight_kg
                              }
                              ; Checked Baggage: Adult, Please see the airline
                              rules
                            </div>

                            <div
                              style={{
                                fontWeight: "400",
                                fontSize: "12px",
                                lineHeight: "15px",
                              }}
                            >
                              Cabin Baggage (Pcs): Adult,
                              {bookingData?.data?.baggage_info[0].cabin_bag_pcs}
                              ; Checked Baggage: Adult, Please see the airline
                              rules
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            marginBottom: "15px",
                          }}
                        >
                          <div
                            style={{
                              flex: "0 0 50%",
                              maxWidth: "33%",
                              borderRight: "1px solid #dee2e6",
                              borderColor: "#e7e7e9",
                              marginTop: "3px",
                            }}
                          >
                            <div
                              style={{
                                marginBottom: ".25rem",
                                backgroundColor: "#e7e7e9",
                                fontSize: "12px",
                              }}
                            >
                              Passenger name
                            </div>
                            {bookingData?.data?.pxn_list &&
                              bookingData?.data?.pxn_list.map((inf, index) => (
                                <div
                                  key={index}
                                  style={{
                                    fontWeight: "400",
                                    fontSize: "11px",
                                  }}
                                >
                                  <i className="fa fa-angle-double-right"></i>
                                  <span
                                    style={{
                                      marginLeft: "5px",
                                    }}
                                  >
                                    {inf.pxn_name}
                                  </span>
                                </div>
                              ))}
                          </div>
                          <div
                            style={{
                              flex: "0 0 50%",
                              maxWidth: "33%",
                              marginTop: "3px",
                            }}
                          >
                            <div
                              style={{
                                paddingLeft: "15px",
                                paddingBottom: "2px",
                                marginBottom: "0.25rem",
                                backgroundColor: "#e7e7e9",
                                fontSize: "11px",
                              }}
                            >
                              Seats:
                            </div>
                            {bookingData?.data?.pxn_list &&
                              bookingData?.data?.pxn_list.map((_, index) => (
                                <div
                                  key={index}
                                  style={{
                                    paddingLeft: "15px",
                                    fontWeight: "400",
                                    fontSize: "11px",
                                  }}
                                >
                                  Check-in Required
                                </div>
                              ))}
                          </div>
                          <div
                            style={{
                              flex: "0 0 50%",
                              maxWidth: "33%",
                              marginTop: "3px",
                            }}
                          >
                            <div
                              style={{
                                paddingLeft: "15px",
                                paddingBottom: "2px",
                                marginBottom: "0.25rem",
                                backgroundColor: "#e7e7e9",
                                fontSize: "11px",
                              }}
                            >
                              Ticket no:
                            </div>
                            {bookingData?.data?.ticket_numbers ? (
                              bookingData?.data?.ticket_numbers.map((inf) => (
                                <>
                                  {inf ? (
                                    <div
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "11px",
                                      }}
                                    >
                                      <i className="fa fa-angle-double-right"></i>
                                      <span
                                        style={{
                                          marginLeft: "5px",
                                        }}
                                      >
                                        {inf}
                                      </span>
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        paddingLeft: "15px",
                                        fontWeight: "400",
                                        fontSize: "11px",
                                      }}
                                    >
                                      Ticket not issued yet
                                    </div>
                                  )}
                                </>
                              ))
                            ) : (
                              <div
                                style={{
                                  paddingLeft: "15px",
                                  fontWeight: "400",
                                  fontSize: "11px",
                                }}
                              >
                                Ticket not issued yet
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCopy;
