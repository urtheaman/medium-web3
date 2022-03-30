import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../type";

interface Props {
  post: Post;
}

const Post: NextPage<Props> = ({ post }) => {
  return (
    <main>
      <Header />

      <div className="relative w-full h-40">
        <Image
          src={urlFor(post.mainImage).url()!}
          alt={post.title}
          layout="fill"
          objectFit="cover"
        />
      </div>

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="text-3xl mt-8 mb-3 ">{post.title}</h1>
        <p className="text-base text-gray-500 mb-2 ">{post.description}</p>

        <div className="flex items-center space-x-2">
          <div className="relative h-10 w-10">
            <Image
              src={urlFor(post.author.profileImage).url()!}
              layout="fill"
              alt={post.author.name}
              objectFit="cover"
              className="rounded-full"
              objectPosition="center"
            />
          </div>
          <p className="font-light text-xs">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
      </article>
    </main>
  );
};

export default Post;

// it'll tell next.js that which path to prepare
export const getStaticPaths = async () => {
  const query = `*[_type == 'post']{
        _id,
        slug {
            current
        }
    }`;

  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking", // when the fallback is set to blocking it'll initially run the getStaticProps and when the fallback is set to true, it'll run the getStaticProps in the background.
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // $slug is a dynamic value and this $slug is the url parameter
  const query = `*[_type == 'post' && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author-> {
            name,
            profileImage
        },
        description,
        mainImage,
        slug,
        body
    }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60, // it'll update the old cached version after 60 seconds
  };
};
