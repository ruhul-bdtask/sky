import TicketCopy from "@/components/ticketCopy/TicetCopy";
import Cookies from "js-cookie";
import React from "react";

export default function page({ searchParams }) {
  const authToken = Cookies.get("auth-token");

  return (
    <div>
      <TicketCopy searchParams={searchParams} authToken={authToken} />
    </div>
  );
}
