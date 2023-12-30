const CreateMockServer = require("./server")

// 自定义vite插件，hook文档：https://cn.vitejs.dev/guide/api-plugin.html#universal-hooks
function ViteMockApiPlugin(options) {
    let server
    return {
        name: "rollup-plugin-mock-api",
        // apply: 'server',
        buildStart: () => {
            server = CreateMockServer(options)
        },
        buildEnd: () => {
            if (server) {
                server.close()
            }
        }
    }
}

module.exports = { ViteMockApiPlugin }