var acl = require("acl");
var mongoose = require("mongoose");
var aclObj = require('../../config/server').aclObj;

// connect to database


var aclm = {

  isValidResourceString: function (resource) {
    return resource && resource.length && resource.indexOf('/') === 0;
  },

  assignRolesToUser: function (user, roles, cb) {
    aclObj.addUserRoles(user, roles, cb);
  },

  assignResourceToRole: function (roles, resources, perms, cb) {
    aclObj.allow(roles, resources, perms, cb);
  },


  isAllowedUser: function (user, resource, perm, cb) {
    acl.isAllowed(user, resource, perm, function (err, res) {
      if (res) {
        console.log("User  is allowed to view blogs")
      }
    })
  },

  removePerms: function (roles, resources, perms, cb) {
    acl.removeAllow(roles, resources, perms, cb);
  },


  removeAllPerms: function (role, resource, cb) {
    // redis.del(getKey(['allows', role, resource]), cb);
  },


  removeRolesResource: function (role, resource, cb) {
    // redis.del(getKey(['allows', role, resource]), permsRemoved);

    function permsRemoved(err, res) {
      if (!err) {
        redis.srem(getKey(['resources', role]), resource, cb);
      } else {
        cb(err);
      }
    }
  },


  /**
   removeUserRoles( userId, roles, function(err) )

   Remove roles from a given Auth.

   @param {String} User id.
   @param {String|Array} Role(s) to remove to the Auth id.
   @param {Function} Callback called when finished.
   */

  removeUserRoles: function (user, roles, cb) {
    acl.removeUserRoles(user, roles, cb);
  },

  removeRole: function (role, cb) {
    acl.removeRole(role, roleRemoved);

    function roleRemoved(err, res) {
      if (!err) {
        aclm.getAllUsers(allUsers);
      } else {
        cb(err);
      }
    }

    var count;

    function allUsers(err, users) {
      if (!err && users && users.length) {
        count = users.length;
        users.forEach(processUser);
      } else {
        cb(err);
      }
    }

    function processUser(user) {
      aclm.getAllGroupsByUser(user, function (err, groups) {
        if (!err && groups && groups.indexOf(role) > -1) {
          aclm.removeUserRoles(user, role, check);
        } else {
          check(err);
        }
      });
    }

    function check(err) {
      if (err) util.log(err);
      if (--count === 0) {
        cb();
      }
    }
  },


  listUsers: function () {

  }

}

module.exports.acl = aclm;


// aclm.isAllowed1(1, '/users/', 'GET');

// function rolesAssigned(err, res) {
//   if (err) {
//     util.log('[Acl Auth]: failed to add role to ' + newuser
//         .email + '. error: ' + err.message);
//   } else {
//     acl.authkey(result.company, setAuthKey);
//   }
// }
function nullcb(err) {
  if (err) {

  }
}

if (require.main === module) {
  (function () {

    // acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'TEST_'));
    //
    assignThings();
    //
    // mongoose.connect("mongodb://localhost/AclDB",function(error){
    //   acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'TEST_'));
    //   var userCollection = mongoose.connection.db.collection('BYG_user');
    //   userCollection.find({},function(err,users){
    //     if(err){
    //       console.log("err occured"+err)
    //     }
    //     console.log("users"+users.key)
    //   });
    //   assignThings();
    // });


  })();
}

function assignThings() {
  console.log("its")
  aclm.assignRolesToUser(19, ['admin'], nullcb);
  // aclm.assignResourceToRole(['guest'], ['/'], '', nullcb);
  // aclm.assignResourceToRole(['member'], ['/'], '', nullcb);
  // aclm.assignResourceToRole(['admin'], ['/'], ['GET', 'POST'], nullcb);
  // console.log("its tough stuff")
  // aclm.isAllowedUser(13, '/', 'GET', console.log);

}



