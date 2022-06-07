import default from "scripts/lib/yoni/basis.js";

//need more info

export default class Entity {
  static objectIsEntity(object){
    let result = false;
    if (typeof object != "object")
      return result;
    
    return result;
  }
}

function resolveTargetSelectors(...selectors){
  let selectedEntities = [];
  selectors.foreach((selector) => {
    resolveTargetSelector(selector).forEach((entity) = > {
      if (selectedEntities.indexOf(entity) == -1)
        selectedEntities.push(entity);
    });
  });
}

function resolveTargetSelector(selector){
  let selectedEntities = [];

  try {
    let tag = String(Math.random());
    dim(0).runCommand(`tag ${selector} add "${tag}"`);
    getLoadedEntities().forEach((entity) => {
      if (entity.hasTag(tag))
        selectedEntities.push(entity);
    });
    dim(0).runCommand(`tag ${selector} remove "${tag}"`);

  } catch {
    selectedEntities = [];
  }

  return selectedEntities;
}

function getLoadedEntities(){
  let loadedEntities = [];
  let dimid = [0,-1,1];
  dimid.forEach((id) => {
    dim(id).getEntities().forEach((entity) => {
      loadedEntities.push(entity);
    });
  });
  return loadedEntities;
}
