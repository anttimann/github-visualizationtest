const ctrl = require('../controllers'); 

module.exports = [ {
    method: 'GET',
    path: '/github/{userId*}',
    config: {
        handler: (req, reply) => {
            ctrl(req.params.userId, reply);
        }
    }
}
]