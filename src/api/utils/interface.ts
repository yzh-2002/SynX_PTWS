export interface ApiType {
    path?:string, 
    method:'post' | 'get'
    header?:any 
    config?:any //请求配置（ TODO 后期可以考虑将headers归为config）
    permission?:Array<string> //权限列表，无权限则无法发出请求（前端限制）
}