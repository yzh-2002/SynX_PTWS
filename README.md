# LarkWebAppDemo
飞书网页应用开发示例

## 目录结构

1. views：页面组件
   1. App：移动端与PC端通用组件
   2. web
   3. mobile
2. ...



## Deploy

1. 前端页面打包（记得注释掉[vite.config.ts](./vite.config.ts)中的`ViteMockApiPlugin`插件）:`yarn run build`
    1. 本应用为多页应用，web与mobile分页，通过[global.ts](./config/global.ts)中`entryKey`指定
2. 创建nginx镜像：`docker build -t larkwebapp:demo .`
3. 创建nodejs服务镜像（前端开发测试使用，实际使用后端开发服务）
    1. 更改[server.js](./mock/server.js)
    2. `docker build -t larkwebserver:demo`
4. 容器运行
    1. `docker run -p 5173:5173 -it larkwebapp:demo`
    2. `docker run -p 3001:3001 -it larkwebserver:demo`
