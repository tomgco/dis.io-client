Dis.io

This is a general playpen for various work units and the final client component for dis.io

**WorkUnit Object**
----
    {
        id: String // a uniquly generated id
      , data: String // A string representation of the provided JS workunit
    }

**WorkUnit Message Object Outbound from client**
----
    {
        cmd: String // `start` || `stop` - The command to send to the worker
      , state: State // A State Object
    }