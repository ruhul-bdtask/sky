import { format } from "date-fns";

export const formatLongDate = (dateString) => {
  if (!dateString) return "";
  return format(new Date(dateString), "dd/MM/yyyy");
};
