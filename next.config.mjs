/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Keep `docker compose up --build` focused on producing a runnable local demo.
    // The existing app has lint debt that should be fixed separately.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
