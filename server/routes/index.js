module.exports = {
    method: 'GET',
    path: '/',
    config: {
        handler: (request, reply) => {
            reply.view('index', {
                g_page_name: process.env.npm_package_name,
                g_page_description: process.env.npm_package_description
            })
        }
    }
};