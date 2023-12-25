/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GITHUB_APP_CLIENT_ID: "Iv1.1cc7a38a43f38b21",
    GITHUB_APP_CLIENT_SECRET: "ca9a3a6ad4c9324dfb7bb214756f5dcf6ab9e0c4",
    NEXTAUTH_SECRET: "RBHom7KQJSO2zULTHQA4jqfAKk+mCIf24luz0FWy+1Y=",
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
};

module.exports = nextConfig
