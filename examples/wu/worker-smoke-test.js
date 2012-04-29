/**
 *  Simple work unit demonstrating the use of the work and communication API's
 *  It will reply with a message once it has received a work unit.
 * This is used for testing and debugging the communication layers between each component.
 */

/**
 * @Required
 * called when a work unit is called, this is part of the Web Worker API
 */
worker.onStart = function(data) {
  Communication.end({ msg: 'no smoke without fire =]'});
};

/**
 *  @optional
 * This is called when a worker receives a message.
 * Currently not implemented in processor.js, however can be used in the future for
 * notifying clients that a distributor is about to shutdown.
 */
worker.onMessage = function(data) {
};