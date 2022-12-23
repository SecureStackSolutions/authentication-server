import { Dialect } from 'sequelize';

const _config: Config = {
    dev: {
        database: {
            username: 'postgres',
            password: 'postgres_password',
            database: 'postgres',
            host: 'postgres',
            port: 5432,
            dialect: 'postgres',
        },
        secrets: {
            authenticationTokenSecret: 'my-super-secret2',
        },
    },
    prod: {
        database: {
            username: process.env.DB_USERNAME!,
            password: process.env.DB_PASSWORD!,
            database: process.env.DB_DATABASE!,
            host: process.env.DB_HOST!,
            port: +process.env.DB_PORT!,
            dialect: process.env.DB_DIALECT! as Dialect,
        },
        secrets: {
            authenticationTokenSecret: process.env
                .ACCESS_TOKEN_SECRET as string,
        },
    },
};

export const config = _config[process.env.ENVIRONMENT!];

interface Config {
    [key: string]: {
        database: any;
        secrets: {
            authenticationTokenSecret: string;
        };
    };
}
