type TEnv = {
  PORT: number;
  JWT_SECRET: string;
  MONGO_URI: string;
  DB_NAME: string;
  cloud_name: string;
  api_key: string;
  api_secret: string;
};

const env: TEnv = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  MONGO_URI: process.env.MONGO_URI || "mongodb+srv://gauravkarki0927:gauravkarki0927@cluster0.lp3l6vb.mongodb.net/flowdesk?appName=Cluster0",
  DB_NAME: process.env.DB_NAME || "flowdesk",
  cloud_name: process.env.CLOUD_NAME || "dslzx6qks",
  api_key: process.env.API_KEY || "619242651474882",
  api_secret: process.env.API_SECRET || "Bfx5e7n0jx9daRq_D0rfPpUWzPc",
};

export default env;
