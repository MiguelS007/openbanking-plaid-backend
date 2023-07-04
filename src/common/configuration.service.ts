export class Configuration {
  static get envs() {
    return () => ({
      environment: process.env.NODE_ENV || 'Development',
      timezone: 'America/Sao_Paulo',
      port: process.env.NODE_PORT || 8080,
      loggingLevel: process.env.GCLOUD_LOGGING_MINIMUM_LEVEL || 'info',
      plaid: {
        clientId: process.env.PALID_CLIENT_ID,
        clientSecret: process.env.PLAID_CLIENT_SECRET,
        env: process.env.PLAID_ENV,
      },
    });
  }
}
