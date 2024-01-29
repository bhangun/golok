/**
 * golokModel
 * @param {String} model
 * @return {String} value
 */
export function golokModel(model) {
  return {
    info: {
      title: model.title,
    },
    applications: {
      frontend: {
        appsName: model.applications.appsName,
        framework: model.applications.framework,
        packageName: model.applications.packages,
        localDatabase: sqlite,
        admin: true,
        themes: light,
        stateManagement: riverpod,
        platform: all,
        locale: en, id,
        entities: model.applications.entities,
      },
    },
  };
}
