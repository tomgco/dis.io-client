exports.createState = function() {
  var stateless = (localStorage === undefined)
    , state = this
    ;

  function getState(workUnitID) {
    return stateless ? stateless : localStorage.getItem(workUnitID) ;
  }

  function setState(workUnitID, newState) {
    console.log(stateless);
    return stateless ? stateless : localStorage.setItem(workUnitID, JSON.stringify(newState));
  }

  function clearState() {
    return stateless ? stateless : localStorage.clear();
  }

  state.getState = getState;
  state.setState = setState;
  state.isStateloss = stateless;

  return state;
};