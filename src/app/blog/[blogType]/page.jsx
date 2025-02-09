import BlackBlog from "@/components/blogs/BlackBlog";
import BlogTypeCard from "@/components/blogs/BlogTypeCard";

export default function page() {
  return (
    <div>
      <BlackBlog />
      <BlogTypeCard />
    </div>
  );
}

// export async function getServerSideProps({ params }) {
//   const res = await fetch(
//     `http://143.110.191.53/b2c/api/articles/${params.blohType}`
//   );
//   const blog = await res.json();

//   return {
//     props: { blog },
//   };
// }
