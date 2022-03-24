import { createCurrentUserHook, createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const config = {
  dataset: process.env.NEXT_PUBLIC_PROJECT_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  apiVersion: "v2021-10-21",
  useCdn: process.env.NODE_ENV === "production",
};

// set up the client for fetching data in the getProps page functions
export const sanityClient = createClient(config);

// sets up a helper function for generating Image urls with only the asset reference data in your documents.
export const urlFor = (source) => imageUrlBuilder(config).image(source);

export const useCurrentUser = createCurrentUserHook(config);
