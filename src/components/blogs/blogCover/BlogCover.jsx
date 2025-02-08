import Image from "next/image";
import blog1 from "@/public/images/blog1.png";
import blog2 from "@/public/images/blog2.png";
import blog4 from "@/public/images/blog4.png";
import blog6 from "@/public/images/blog6.png";

const BlogCover = ({ category }) => {
  return (
    <div className="lg:col-span-1">
      <div className=" rounded-lg  overflow-hidden">
        <Image
          src={
            category === "travelexperiences"
              ? blog2
              : category === "travel-recommended"
              ? blog4
              : category === "tips-and-tricks"
              ? blog6
              : blog1
          }
          alt="Tropical destination"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default BlogCover;
