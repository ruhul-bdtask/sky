import HomePage from "@/components/homePage/HomePage";
import { toast } from "react-toastify";

export default function Home({ searchParams }) {
  return (
    <div>
      <HomePage searchParams={searchParams} />
    </div>
  );
}
