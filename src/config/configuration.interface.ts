export interface Configuration {
  port: number;
  nodeEnv: string;
  mongodbUri: string;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  cors: {
    frontendUrl: string;
    productionUrl: string;
  };
  crmMarketplace: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string;
    authUrl: string;
    tokenUrl: string;
    sharedSecret: string;
  };
}
