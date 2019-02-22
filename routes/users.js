var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(err, users){
        res.json(users);
    });
});

/*
 * GET user.
 */
router.get('/user/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.findById(req.params.id, function (err, user) {
        res.json(user);
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * PUT to edituser.
 */
router.put('/edituser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToUpdate = req.body.id;
    collection.update({id: userToUpdate}, req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;