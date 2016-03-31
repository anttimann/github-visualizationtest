module.exports = {
    baseUrl: 'https://api.github.com/',
    retryDelay: 2000,
    userAgent: 'github-visualization',
    user: process.env.GITHUB_USERNAME,
    password: process.env.GITHUB_PASSWORD
};