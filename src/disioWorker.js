/**
 * This is a browser implementation of the processor for the client
 * @author Tom Gallacher
 */

// imports the communication wrapper to work with webworkers and nodes cluster || child proccess fork
importScripts('disio-client-communication.js');
//importScripts('workunit.js'); // data URI for the main work unit

//time for some psuedo code
var State = exports.createState()
  , WorkUnit = exports.createWorkUnit();

WorkUnit.start(function(err) {
  // on completion.
  if (err) {
    // Handle error
    console.log(err);
  } else if (!err) {
    localStorage.clear();
    // request new work unit
  }
});