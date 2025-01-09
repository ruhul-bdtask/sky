import { format } from "date-fns";

export const formatLongDate = (dateString) => {
  return format(new Date(dateString), "dd/MM/yyyy");
};
