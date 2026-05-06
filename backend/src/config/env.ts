type TEnv = {
  PORT: number;
  JWT_SECRET: string;
  MONGO_URI: string;
  DB_NAME: string;
};

const env: TEnv = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  MONGO_URI: process.env.MONGO_URI || "mongodb+srv://gauravkarki0927:gauravkarki0927@cluster0.lp3l6vb.mongodb.net/flowdesk?appName=Cluster0",
  DB_NAME: process.env.DB_NAME || "flowdesk",
};

export default env;
