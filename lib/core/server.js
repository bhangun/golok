
/**
 * Server
 */
export class Server {
    constructor(raw)
        /* framework, name,
        packageName,
        applicationType,
        serviceDiscoveryType,
        authenticationType,
        databaseType,
        prodDatabaseType,
        devDatabaseType,
        cacheProvider,
        enableHibernateCache,
        buildTool, serverPort, skipUserManagement, entities) */ {
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
  
    setPackageName(packageName) {
      this.packageName = packageName;
    }
  
    setApplicationType(applicationType) {
      this.applicationType = applicationType;
    }
  
    setServiceDiscoveryType(serviceDiscoveryType) {
      this.serviceDiscoveryType = serviceDiscoveryType;
    }
  
    setAuthenticationType(authenticationType) {
      this.authenticationType = authenticationType;
    }
  
    setDatabaseType(databaseType) {
      this.databaseType = databaseType;
    }
  
    setProdDatabaseType(prodDatabaseType) {
      this.prodDatabaseType = prodDatabaseType;
    }
  
    setDevDatabaseType(devDatabaseType) {
      this.devDatabaseType = devDatabaseType;
    }
  
    setCacheProvider(cacheProvider) {
      this.cacheProvider = cacheProvider;
    }
  
    setEnableHibernateCache(enableHibernateCache) {
      this.enableHibernateCache = enableHibernateCache;
    }
  
    setBuildTool(buildTool) {
      this.buildTool = buildTool;
    }
  
    setServerPort(serverPort) {
      this.serverPort = serverPort;
    }
  
    setSkipUserManagement(skipUserManagement) {
      this.skipUserManagement = skipUserManagement;
    }
  
    setEntities(entities) {
      this.entities = entities;
    }
  }
  