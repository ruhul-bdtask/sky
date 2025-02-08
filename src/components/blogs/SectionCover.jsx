import blog1 from "@/public/images/blog1.png";

const SectionCover = ({ sectionImage }) => {
  function getImgUrl(name) {
    return new URL(`@/public/images/blog1.png`, import.meta.url).href;
  }

  return (
    <div className="lg:col-span-1 md:p-10">
      <div className="rounded-lg overflow-hidden">
        <img
          height={600}
          width={600}
          src={
            sectionImage
              ? sectionImage
              : new URL(`@/public/images/blog1.png`, import.meta.url).href
          }
          alt="Tropical destination"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SectionCover;
