import blog1 from "@/public/images/blog1.png";
import blog4 from "@/public/images/blog4.png";
import Image from "next/image";

const SectionCover = ({ category }) => {
  function getImgUrl(name) {
    return new URL(`@/public/images/blog4.png`, import.meta.url).href;
  }
  console.log(category);
  return (
    <div className="lg:col-span-1 md:p-4">
      <div className="rounded-lg overflow-hidden">
        <Image
          height={600}
          width={600}
          src={category?.image || blog4}
          alt="Tropical destination"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SectionCover;
