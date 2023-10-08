# 前端面试必备——权限控制

## 1.接口权限

**原则**

接口权限最简单，目前一般采用jwt的形式来验证，没有通过的话一般返回401 Authentication Required, **返回登录页重新登录**
登录完拿到 **Token** ,将token存起来（cookie或者ssessionStorage），每次登录的时候头部携带token就行了（axios请求拦截器实现）。

**伪码实现**

```js
const {token} = login()
cookie.set('token',token)
axios.interceptors.request.use(config => {
    config.headers['token'] = cookie.get('token')
    return config
})
axios.interceptors.response.use(res=>{},{response}=>{
    if (response.data.code === 40099 || response.data.code === 40098) { //token过期或者错误
      router.push('/login')
    }
})
```

## 2.按钮权限

**原则**

一个页面会有新增，删除，编辑等等按钮。不同用户应该是有不同操作权限的。
我们不妨定义权限码 0：不可见 1:不可编辑 2:可编辑
我们提前和后端约定好按钮的名字，后端会返回一个按钮权限列表。然后我们根据权限列表使用v-if指令或者 绑定disabled属性达到相应权限效果。
当然更好的最好是自己写一个自定义权限指令，实质就是根据相应权限操作dom

**伪码实现**

比如概览页面的编辑按钮 名字先和后端定义好叫做overview-edit

```js
// overviwe.vue  overview是概览页面的路由名
...
<button v-auth='edit'>
...
//util.js 全局注册自定义指令

Vue.directive('auth', {
    inserted: function (el, binding, vnode) {
        const optName = binding.arg
        const authName = `${routeName}-${optName}`     //这里根据路由名和操作类型拼出按钮名 overview-edit
        const btnAuthList = store.state.auth.btnAuthList
        if (btnAuthList[authName]===0) { // 按钮权限为0则移除dom
            el.parentNode.removeChild(el)
        } else if (btnAuthList[authName]===1) { // 按钮权限为1则禁用按钮
            vnode.componentInstance.disabled = true
        }
    }
})

// 登录的时候接受按钮权限并存在vuex里面
const {btnAuthList} = login()
vuex.state.btnAuthList = btnAuthList
```

## 3.页面权限（菜单权限）

个人认为页面权限实际上就是菜单权限，如果说我们没有去某个页面的导航菜单，实际上就是没有去那个页面的权限了，所以说页面权限的实际就是菜单权限。

**原则**

一句话，**获取菜单权限列表，动态递归生成菜单**
这个菜单权限列表可以是后台直接返回你的，也可以是你注册路由的时候写在meta里面的菜单信息，后台返回路由权限，你根据meta信息动态算出的菜单权限。
至于菜单肯定是根据菜单权限递归生成的

**伪码实现**

```js
//如果是定义在route信息里面会是这种样子
//我们可以根据后端返回的路由权限结合meta算出菜单权限
{
    name:xxx
    path:xxx
    meta: {
        role: [xxx,xxx,xxx] //哪些角色有资格
        MenuIcon: 'xxxx'  //菜单图标
        MenuTitle: 'xxx' //菜单名
    }
}

//当然也可以麻烦后台直接生成菜单权限返回来
const {menuList} = login()
//存vuex里
vuex.state.menuList = menuList
//在侧边栏或者顶部菜单组件里动态生成菜单
//这里基本都是用的UI库，比如element-ui的NavMenu来实现的，大家有兴趣可以自己看文档，当然也可以自己递归实现，不难
<navMenu/ :menuList=menuList>
```

## 4.路由权限

上面的菜单权限虽然做到能看不见菜单，但是我可以通过直接输入url的方式去没有权限的页面呀，这种情况需要靠我们的 **路由权限** 来阻止。

**原则**

这里有两个方案
**第一种**，也是我目前项目用的，先注册好所有的路由，然后获取有资格访问的路由权限列表，最后直接通过Router.beforeEach来判断，每次跳路由的时候判断是否在权限列表里，在的话就放行，**不在就提示权限不够**
优点：简单暴力，**不会跳到404页面（因为去的路由能在路由规则里找到）**
缺点：由于初始化了所有路由，运行的时候会挂载不必要的路由（？有待考究）
**第二种**，先只注册基本路由，然后获取路由权限列表，然后借助route.add() API根据权限列表将有权限的路由动态注册到路由规则上
优缺点与第一种正好相反

**伪码实现**

这里只写第一种方案，第二种大家自行google

```js
const {routeAuthList} = login()
cosnt whiteList = ['/login','/','/404']
//合并生成总路由
whiteList = whiteList.contact(routeAuthList)
//存vuex
vuex.state.whiteList = whiteList
//路由守卫判断
router.beforeEach((to, from, next) => {
    //权限校验
    let pass = whiteList.inclue(to);
    if(!pass){
        return console.log('无权访问');
    }
    next();
});
```
