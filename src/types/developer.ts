/** Shared maker identity. Slugs are stable anchors on /makers. */
export type Developer = {
  slug: string;
  name: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  email?: string;
  websiteUrl?: string;
};

/** Extended background stays on the makers page, separate from game previews. */
export type MakerProfile = {
  role: string;
  introduction: string;
  specialties: string[];
  sections: {
    title: string;
    entries: { title: string; detail?: string; description: string }[];
  }[];
};
