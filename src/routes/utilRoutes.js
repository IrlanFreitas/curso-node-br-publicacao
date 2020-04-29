const Routes = require("./base/routes");
const { join } = require('path')


class UtilRoutes extends Routes {

    coverage() {
        return {
            path: '/coverage/{param*}',
            method: 'GET',
            config: {
                auth: false
            },
            handler: {
                directory: {
                    path: join(__dirname, '../../coverage'),
                    redirectToSlash: true,
                    index: true
                }
            }
        }
    }
}

module.exports = UtilRoutes