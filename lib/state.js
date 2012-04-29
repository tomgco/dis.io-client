/**
 * @deprecated
 * This is an old version of saving the state of a work unit.
 * Originally it was going to save on the client, however it made more sense
 * to place on the server and allow new clients to start where old ones left off.
 */
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