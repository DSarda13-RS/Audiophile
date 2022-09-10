import {Pool, PoolConfig} from 'pg';
import {pool_conf,pool_config_test} from "./validations/config";
let pool: Pool;
function set_connection_pool(config: PoolConfig) {
    if(config === pool_conf.dev){
        pool = new Pool(pool_conf.dev as PoolConfig);
    } else if(config === pool_config_test.test){
        pool = new Pool(pool_config_test.test as PoolConfig);
    }
}
export {
    set_connection_pool,
    pool
};

