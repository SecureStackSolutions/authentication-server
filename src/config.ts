import { Dialect } from 'sequelize';

const _config: Config = {
    dev: {
        admin: {
            databaseUrl: process.env.ADMIN_DB_URL!,
            serviceAccountCert: JSON.parse(
                process.env.ADMIN_SERVICE_ACCOUNT_CERT!
            ),
        },
        database: {
            username: 'postgres',
            password: 'postgres_password',
            database: 'postgres',
            host: 'postgres',
            port: 5432,
            dialect: 'postgres',
        },
        secrets: {
            accessTokenSecret: 'my-access-secret',
            refreshTokenSecret: 'my-refresh-secret',
            refreshTokenPayloadSecret: 'my-refresh-secret',
            tokenFamilySecret: 'my-tokenfamily-secret',
            userIdSecret: 'my-userid-secret',
        },
    },
    prod: {
        admin: {
            database: process.env.ADMIN_DB_URL!,
            serviceAccountCert: process.env.ADMIN_SERVICE_ACCOUNT_CERT!,
        },
        database: {
            username: process.env.DB_USERNAME!,
            password: process.env.DB_PASSWORD!,
            database: process.env.DB_DATABASE!,
            host: process.env.DB_HOST!,
            port: +process.env.DB_PORT!,
            dialect: process.env.DB_DIALECT! as Dialect,
        },
        secrets: {
            accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
            refreshTokenSecret: 'my-refresh-secret',
            refreshTokenPayloadSecret: 'my-refresh-secret',
            tokenFamilySecret: 'my-tokenfamily-secret',
            userIdSecret: 'my-userid-secret',
        },
    },
};

export const config = _config[process.env.ENVIRONMENT!];

interface Config {
    [key: string]: {
        admin: any;
        database: any;
        secrets: {
            accessTokenSecret: string;
            refreshTokenSecret: string;
            tokenFamilySecret: string;
            userIdSecret: string;
            refreshTokenPayloadSecret: string;
        };
    };
}
