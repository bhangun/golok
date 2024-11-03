"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
/**
 * Server
 */
var Server = /** @class */ (function () {
    function Server(raw) {
        this.framework = framework;
        this.name = name;
        packageName = packageName; // String -> com.golok.demo
        applicationType = applicationType; // String -> microservice
        serviceDiscoveryType = serviceDiscoveryType; // String -> eureka
        authenticationType = authenticationType; // String -> jwt
        databaseType = databaseType; // String -> mysql | mongodb
        prodDatabaseType = prodDatabaseType; // String -> mysql | mongodb
        devDatabaseType = devDatabaseType; // String -> mysql | mongodb
        cacheProvider = cacheProvider; // String -> no | ehcache
        enableHibernateCache = enableHibernateCache; // bool ->  false
        buildTool = buildTool; // String -> maven | gradle
        serverPort = serverPort; // Integer -> 8083
        skipUserManagement = skipUserManagement; // bool true
        entities = entities; // List<String> -> Product, Order
    }
    Server.prototype.setPackageName = function (packageName) {
        this.packageName = packageName;
    };
    Server.prototype.setApplicationType = function (applicationType) {
        this.applicationType = applicationType;
    };
    Server.prototype.setServiceDiscoveryType = function (serviceDiscoveryType) {
        this.serviceDiscoveryType = serviceDiscoveryType;
    };
    Server.prototype.setAuthenticationType = function (authenticationType) {
        this.authenticationType = authenticationType;
    };
    Server.prototype.setDatabaseType = function (databaseType) {
        this.databaseType = databaseType;
    };
    Server.prototype.setProdDatabaseType = function (prodDatabaseType) {
        this.prodDatabaseType = prodDatabaseType;
    };
    Server.prototype.setDevDatabaseType = function (devDatabaseType) {
        this.devDatabaseType = devDatabaseType;
    };
    Server.prototype.setCacheProvider = function (cacheProvider) {
        this.cacheProvider = cacheProvider;
    };
    Server.prototype.setEnableHibernateCache = function (enableHibernateCache) {
        this.enableHibernateCache = enableHibernateCache;
    };
    Server.prototype.setBuildTool = function (buildTool) {
        this.buildTool = buildTool;
    };
    Server.prototype.setServerPort = function (serverPort) {
        this.serverPort = serverPort;
    };
    Server.prototype.setSkipUserManagement = function (skipUserManagement) {
        this.skipUserManagement = skipUserManagement;
    };
    Server.prototype.setEntities = function (entities) {
        this.entities = entities;
    };
    return Server;
}());
exports.Server = Server;
