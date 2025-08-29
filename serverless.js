require('dotenv').config();

module.exports = {
    service: "smartnode-backend",
    frameworkVersion: "3",
    provider: {
        name: "aws",
        runtime: "nodejs18.x",
        region: "ap-south-1",
        environment: {
            MONGODB_URI: process.env.MONGODB_URI,
            SUN_API_BASE: process.env.SUN_API_BASE || 'https://api.sunrise-sunset.org/json',
        },
    },
    plugins: [
        "serverless-offline",
        "serverless-offline-scheduler",
    ],
    functions: {
        fetchSunDataCron: {
            handler: "serverless-handlers.fetchSunDataCron",
            events: [
                { schedule: "rate(1 day)" },
            ],
        },
    },
};