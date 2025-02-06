"use client";

const Page = () => {
  return <div className="text-center text-2xl p-5">Blog details page </div>;
};

// export async function getServerSideProps(context) {
//   const { slug } = context.params;

//   // const { data, isLoading, isError, error } = useFetchBlogs(`/${slug}`);

//   // const res = await fetch(`http://143.110.191.53/b2c/articles/${slug}`);
//   // const blog = await res.json();
//   console.log(slug);
//   return {
//     props: { slug },
//   };
// }

export default Page;
