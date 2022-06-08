/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_REACT_APP_DYTE_BASE_URL: process.env.NEXT_PUBLIC_REACT_APP_DYTE_BASE_URL,
    NEXT_PUBLIC_REACT_APP_MY_BACKEND: process.env.NEXT_PUBLIC_REACT_APP_MY_BACKEND,
    NEXT_PUBLIC_REACT_APP_DYTE_ORG_ID: process.env.NEXT_PUBLIC_REACT_APP_DYTE_ORG_ID,
  }
}

module.exports = nextConfig
