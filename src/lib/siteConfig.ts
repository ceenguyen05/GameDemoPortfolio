/** Production origin, without a trailing slash. Override with NEXT_PUBLIC_SITE_URL for a custom domain. */
const url = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://gamedemoportfolio.vercel.app"
).replace(/\/+$/, "");

export const siteConfig = {
  name: "Casey Nguyen / Games",
  description:
    "Browser games by Casey Nguyen. See every game, learn the controls, and launch straight into the live build.",
  url,
  github: "https://github.com/ceenguyen05",
  email: "ceen2327@gmail.com",
};
