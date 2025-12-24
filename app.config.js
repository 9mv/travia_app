// app.config.js - For environment variable support
export default ({ config }) => {
  // Only use .env API key in development, not in release builds
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  return {
    ...config,
    extra: {
      ...config.extra,
      // Only include API key in development builds
      ...(isDevelopment && {
        openRouterApiKey: process.env.OPENROUTER_API_KEY,
        openRouterBaseUrl: process.env.OPENROUTER_BASE_URL,
      }),
      eas: {
        projectId: "582dc9ef-7161-4f5c-ab4d-1369e78c75f9"
      }
    },
  };
};
