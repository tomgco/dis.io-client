Dis.io

`examples/` is a general playpen for various work units to be tested, it contains various pieces of code to run client and server side.

`lib/` contains two libraries, the first `state.js` was initially going to be used for saving the state of workunits, however this was superceeded by the distributor. `communication.js` will appended to any work unit. This provides a standardised communication layer that all work unit's have in common.

`server.js` a simple webserver to server up an example app, this would usually be ran on the webserver which was to distribute the js to initialise the artefact, it will serve `test/index.html` on http://localhost:3001.

`src/` contains `processor.js` this is the code which is responsible for initialising and starting the work unit, it also provides a method to get a list of distributors (for testing, this will usually be achieved by a loadbalancer).


Reference to commands which will be sent:

WorkUnit Object
    {
        id: String // a uniquly generated id
      , data: String // A string representation of the provided JS workunit
    }

WorkUnit Message Object Outbound from client**
    {
        cmd: String // `start` || `stop` - The command to send to the worker
      , 'workUnitId': workUnitId // the workUnits id
      , state: State // A State Object
    }