
export {
  golokModel, getFront,
};

/**
 * golokModel
 * @param {String} model
 * @return {String} value
 */
function golokModel(model) {
  return {
    info: {
      title: model.info.title,
    },
    applications: {
      frontend: getFront(model),
    },
  };
}

/**
 * getFront
 * @param {String} model
 * @return {String} value
 */
function getFront(model) {
  return {
    appsName: model.applications.appsName,
    framework: model.applications.framework,
    packageName: model.applications.packages,
    localDatabase: 'sqlite',
    admin: true,
    themes: 'light',
    stateManagement: 'riverpod',
    platform: 'all',
    locale: 'en, id',
    entities: model.applications.entities,
  };
}
