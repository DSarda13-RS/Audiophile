const pool_conf ={
    dev: {
        driver: 'pg',
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    }
}
const pool_config_test ={
    test: {
        driver: 'pg',
        user: process.env.DB_USER_TEST,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD_TEST,
        port: parseInt(process.env.DB_PORT_TEST || '8090',10),
        database: process.env.DB_NAME_TEST
    }
}
export {
    pool_config_test,
    pool_conf
}

