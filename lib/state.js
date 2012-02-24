exports.createState = function(workUnitID) {
  var stateless = (localStorage === undefined)
    , state = this;

  function getState() {
    return !stateless || JSON.parse(localStorage.getItem(workUnitID));
  }

  function setState(newState) {
    return !stateless || localStorage.setItem(workUnitID, JSON.stringify(newState));
  }

  state.getState = getState;
  state.setState = setState;
  state.isStateloss = stateless;

  return state;
};