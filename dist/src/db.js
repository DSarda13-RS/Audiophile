"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.set_connection_pool = void 0;
const pg_1 = require("pg");
const config_1 = require("./validations/config");
let pool;
exports.pool = pool;
function set_connection_pool(config) {
    if (config === config_1.pool_conf.dev) {
        exports.pool = pool = new pg_1.Pool(config_1.pool_conf.dev);
    }
    else if (config === config_1.pool_config_test.test) {
        exports.pool = pool = new pg_1.Pool(config_1.pool_config_test.test);
    }
}
exports.set_connection_pool = set_connection_pool;
