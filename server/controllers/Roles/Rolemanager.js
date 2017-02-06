var acl = require('../../models/Roles/Acl').acl;

var manager = {
  
  /* Users is the id(number,email) 
  * roles are ['admin','guest']
  * permissions are ['GET','POST']
  * */

 
    newRole: function (req, res, next) {
    var role = req.body.role;
    var resources = req.body.resources;
    var perms = req.body.perms;

    acl.assignResourceToRole(role, resources, perms, assignedResourceToRole);

    function assignedResourceToRole(err) {
      if (!err) {
        res.json({
          result: 'success'
        });
      } else {
        next(err);
      }
    }
  },

  delRole: function delgroup(req, res, next) {
    var role = (req.body.role || '').trim();
    if (!role) {
      return next(new Error('Missing required param'));
    }

    acl.removeRole(role, roleRemoved);

    function roleRemoved(err) {
      res.json({
        result: err ? 'failed' : 'success',
        error: err ? err.message : ''
      });
    }
  },
  
  
  updateRole: function(req,res){
    
  },
  
  listRoles: function(req,res){
    
  },
  
  
  //for editing roles, just del the role and add the role

  
  getAllUsersByRole: function (cb) {
    var map = {};
    aclm.getAllUsers(allUsers);

    function allUsers(err, users) {
      if (err) return cb(err);
      async.eachSeries(users, processUser, returnMap);
    }

    function processUser(user, lcb) {
      aclm.getAllGroupsByUser(user, function (err, groups) {
        if (err) return lcb(err);
        groups.forEach(function (g) {
          if (!map[g]) map[g] = [];
          map[g].push(user);
        });

        lcb();
      });
    }

    function returnMap(err) {
      cb(err, map);
    }
  },

  getAllRoles: function (cb) {
    // redis.smembers(getKey('roles'), cb);
  },


  getAllResourcesByRole: function (role, cb) {
    acl.whatResources(role, cb);
  },


  
  newUser: function newuserfn(req, res, next) {
    var roles = req.body.roles;
    var users = req.body.users;

    if (!roles || !roles.length || !users || !users.length) {
      return next(new Error('Missing required params'));
    }

    var count = users.length;
    var errs = [];
    var check = function (err) {
      if (err) errs.push(err);
      if (--count === 0) {
        res.json({
          result: errs.length ? 'failed' : 'success',
          error: errs.join(',')
        });
      }
    };

    users.forEach(function (user) {
      acl.assignRolesToUser(user, roles, check);
    });
  },


  delUser: function deluserfn(req, res, next) {
    var user = (req.body.user || '').trim();
    if (!user) {
      return next(new Error('Missing required param'));
    }

    acl.removeUser(user, userRemoved);

    function userRemoved(err) {
      res.json({
        result: err ? 'failed' : 'success',
        error: err ? err.message : ''
      });
    }
  },

  updateUser: function updateuser(req, res, next) {
    var roles = req.body.roles;
    var user = (req.body.user || '').trim();
    if (!user) {
      return next(new Error('missing required params'));
    }

    acl.removeUser(user, userRemoved);

    function userRemoved(err) {
      if (err) {
        return next(err);
      }

      acl.assignRolesToUser(user, roles, assignedRolesToUser);
    }

    function assignedRolesToUser(err) {
      res.json({
        result: err ? 'failed' : 'success',
        error: err ? err.message : ''
      });
    }
  },

  listUsers: function (cb) {
    // redis.smembers(getKey('users'), cb);
  },

  userDetails: function userdetails(req, res, next) {
    acl.getAllGroupsByUser(req.params.userName, allGroupsByUser);

    function allGroupsByUser(err, users) {
      if (!err && users) {
        res.json({
          result: 'success',
          users: users,
          authkey: req.authkey || ''
        });
      } else {
        next(err || new Error('Error getting Auth details'));
      }
    }
  },



  addResourceToRole: function addresource(req, res, next) {
    var role = req.body.role;
    var resources = req.body.resources;
    var perms = req.body.perms;

    acl.assignResourceToRole(role, resources, perms, resourceAdded);

    function resourceAdded(err) {
      if (!err) {
        res.json({
          result: 'success'
        });
      } else {
        next(err);
      }
    }
  },

  delResource: function delresource(req, res, next) {
    var role = req.body.role;
    var resources = req.body.resources;
    if (!util.isArray(resources)) resources = [resources];

    if (!role || !resources || !resources.length) {
      return next(new Error('missing required params'));
    }

    var count = resources.length;
    var errs = [];
    var check = function (err) {
      if (err) errs.push(err.message);
      if (--count === 0) {
        res.json({
          result: errs.length ? 'failed' : 'success',
          error: errs.join(',')
        });
      }
    };

    resources.forEach(function (resource) {
      acl.removeRolesResource(role, resource, check);
    });
  }


}

module.exports.roleManager = manager;