exports.createState = function() {
  var stateless = (localStorage === undefined)
    , state = this
    ;

  function getState(workUnitID) {
    return !stateless || localStorage.getItem(workUnitID);
  }

  function setState(workUnitID, newState) {
    return !stateless || localStorage.setItem(workUnitID, JSON.stringify(newState));
  }

  function clearState() {
    return !stateless || localStorage.clear();
  }

  state.getState = getState;
  state.setState = setState;
  state.isStateloss = stateless;

  return state;
};