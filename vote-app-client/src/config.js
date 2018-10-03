const dev = {
    s3: {
      REGION: "us-east-1",
      BUCKET: "notes-app-2-api-dev-attachmentsbucket-6wbhcogxihbo"
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://api.serverless-stack.seed-demo.club/dev"
    }
  };
  
  const prod = {
    s3: {
      REGION: "us-east-1",
      BUCKET: "notes-app-2-api-prod-attachmentsbucket-1h5n5ttet1hy0"
    },
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://api.serverless-stack.seed-demo.club/prod"
    }
  };

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};