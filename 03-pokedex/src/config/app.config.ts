export const EnvConfiguration = () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    monodb: process.env.MONGODB,
    port: process.env.PORT ?? 3001,
    defaultLimit: process.env.DEFAULT_LIMIT ?? 10,
})
;