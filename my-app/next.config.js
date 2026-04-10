/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    const api =
      process.env.USER_API_URL ||
      process.env.NEXT_PUBLIC_API_URL;
    if (!api || !String(api).trim()) {
      return [];
    }
    const dest = String(api).trim().replace(/\/$/, "");
    return [
      {
        source: "/api/user-proxy/:path*",
        destination: `${dest}/:path*`,
      },
    ];
  },
};
