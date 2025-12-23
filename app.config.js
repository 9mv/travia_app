// app.config.js - For environment variable support
export default ({ config }) => {
  return {
    ...config,
    extra: {
      openRouterApiKey: process.env.OPENROUTER_API_KEY,
      openRouterBaseUrl: process.env.OPENROUTER_BASE_URL,
    },
  };
};
