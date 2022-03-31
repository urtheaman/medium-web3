import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import PortableText from "react-portable-text";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../type";
import { useForm } from "react-hook-form";
import { useState } from "react";

interface Props {
  post: Post;
}

const Post: NextPage<Props> = ({ post }) => {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState("");

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

        <PortableText
          projectId={process.env.NEXT_PUBLIC_PROJECT_ID}
          dataset={process.env.NEXT_PUBLIC_PROJECT_DATASET}
          content={post.body}
          serializers={{
            h1: (props: any) => {
              return <h1 className="text-4xl font-bold my-5" {...props} />;
            },
            h2: (props: any) => {
              return <h2 className="text-2xl font-bold my-5" {...props} />;
            },
            h3: (props: any) => {
              return <h3 className="text-2xl font-bold my-5" {...props} />;
            },
            li: ({ children }: any) => {
              return <li className="ml-4 list-disc">{children}</li>;
            },
            link: ({ href, children }: any) => {
              return (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              );
            },
          }}
        />
      </article>

      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />

      <form
        className="flex flex-col mx-w-2xl mx-auto mb-10 max-w-3xl p-5"
        onSubmit={handleSubmit((data) => setData(JSON.stringify(data)))}
      >
        <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
        <h4 className="text-3xl font-bold">Leave a comment below</h4>
        <hr className="py-3 mt-2" />
        <label className="block mb-5">
          <span className="text-gray-700">Name</span>
          <input
            {...register("name", { required: true })}
            className="shadow border rounded py-2 px-3 form-input mt-1 block ring-yellow-500 focus:ring w-full outline-none transition-all duration-100 ease-out"
            placeholder="Sarah williams"
            type="text"
          />
        </label>
        <label className="block mb-5">
          <span className="text-gray-700">Email</span>
          <input
            {...register("email", { required: true })}
            className="shadow border rounded py-2 px-3 form-input mt-1 block ring-yellow-500 w-full focus:ring outline-none transition-all duration-100 ease-out"
            placeholder="sarah@williams.com"
            type="email"
          />
        </label>
        <label className="block mb-5">
          <span className="text-gray-700">Comment</span>
          <textarea
            {...register("comment", { required: true })}
            className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 focus:ring outline-none transition-all duration-100 ease-out"
            placeholder="type your comment here"
            rows={8}
          ></textarea>
        </label>

        <input
          type="submit"
          className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer"
        />
      </form>
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
