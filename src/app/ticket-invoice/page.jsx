import TicketInvoice from "@/components/ticketInvoice/TicketInvoice";
import Cookies from "js-cookie";
import React from "react";

export default function page({ searchParams }) {
  const authToken = Cookies.get("auth-token");
  return (
    <div>
      <TicketInvoice authToken={authToken} searchParams={searchParams} />
    </div>
  );
}
