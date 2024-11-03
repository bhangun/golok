"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plantuml = plantuml;
/**
 * plantuml
 * @param {String} model
 * @return {String} value
 */
function plantuml(model) {
    const start = `
@startuml
!theme reddress-lightblue

`;
    /* ' avoid problems with angled crows feet
    skinparam linetype ortho */
    let entities = '';
    let relation = '';
    const entitiesIndex = [];
    blueprint.entities.forEach((el, i) => {
        if (el) {
            let entity = 'entity "' + el.name + '" as ' + el.name + '{\n';
            // Add as ID
            entitiesIndex.push(el.name);
            entity += erdBody(el.name, el.properties);
            entity += '}';
            entities += entity + '\n\n';
            relation += relationBody(el.name, el.properties);
        }
    });
    let body = start;
    body += entities;
    body += relation + '\n';
    body += '@enduml';
    return body;
}
/**
 * plantuml
 * @param {String} entityName
 * @param {String} prop
 * @return {String} value
 */
function erdBody(entityName, prop) {
    let body = '';
    if (prop) {
        prop.forEach((el) => {
            if (el.name == 'id') {
                body += ' *' + el.name + ' : ' + el.type + '\n';
                body += ' ---\n';
            }
            else {
                body += ' ' + el.name + ' : ' + el.type + '\n';
            }
        });
    }
    return body;
}
/**
 * plantuml
 * @param {String} entityName
 * @param {String} prop
 * @return {String} value
 */
function relationBody(entityName, prop) {
    let body = '';
    if (prop) {
        prop.forEach((el) => {
            if (el.relation) {
                body += entityName + getRelation(el.relation) + el.type + '\n';
            }
        });
    }
    return body;
}
/**
 * plantuml
 * @param {String} relation
 * @return {String} value
 */
function getRelation(relation) {
    switch (relation) {
        case 'oneToOne':
            return ' |o--|| ';
            break;
        case 'OneToOne':
            return ' |o--|| ';
            break;
        case 'oneToMany':
            return ' |o--}o ';
            break;
        case 'OneToMany':
            return ' |o--}o ';
            break;
        case 'manyToMany':
            return ' }o--}o ';
            break;
        case 'ManyToMany':
            return ' }o--}o ';
            break;
        case 'ManyToOne':
            return ' }o--|| ';
            break;
        case 'manyToOne':
            return ' }o--|| ';
            break;
    }
}
//# sourceMappingURL=plant_utils.js.map