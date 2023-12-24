const axios = require("axios")

import { getAppAccessToken } from "./handleLogin"

// 使用requestAuthCode的临时授权码而不是用户登录后返回的code，区别于handleLogin
// 但是从代码实现角度没有区别

// 所以最后的获取用户信息也没有区别