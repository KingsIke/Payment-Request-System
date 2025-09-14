export default {
  migrationFolder: 'migrations',
  direction: 'up',
    databaseUrl: 'process.env.DATABASE_URL!',
tsConfig: './tsconfig.json',
};
// import { MigrationOptions } from 'node-pg-migrate';

// const config: MigrationOptions = {
//   migrationFolder: 'migrations',
//   direction: 'up',
//   databaseUrl: 'postgresql://paymentsystem_mdrj_user:kK7Ykxm6kyzbN1VRjenOwORclJMhTTTf@dpg-d31tut3ipnbc73cmpb40-a.oregon-postgres.render.com/paymentsystem_mdrj',
//   tsConfig: './tsconfig.json',
// };

// export default config;