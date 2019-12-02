const express = require('express');
const router = express.Router();

/*
 * GET userlist.
 */
router.get('/users', function(req, res) {
    let db = req.db;
    let collection = db.get('userlist');
    collection.find({},{},function(err, users){
        res.json(users);
    });
});

/*
 * GET user.
 */
router.get('/user/:id', function(req, res) {
    let db = req.db;
    let collection = db.get('userlist');
    collection.findOne(req.params.id, function (err, user) {
        res.json(user);
    });
});

/*
 * POST to adduser.
 */
router.post('/user', function(req, res) {
    let db = req.db;
    let collection = db.get('userlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * PUT to edituser.
 */
router.put('/user/:id', function(req, res) {
    let db = req.db;
    let collection = db.get('userlist');
    let userToUpdate = req.body.id;
    collection.update(
        { 
            id: userToUpdate
        }, 
        {
            'fullname': req.body.fullname,
            'age': req.body.age,
            'gender': req.body.gender
        },
        function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/user/:id', function(req, res) {
    let db = req.db;
    let collection = db.get('userlist');
    let userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;