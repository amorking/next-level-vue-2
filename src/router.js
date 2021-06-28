import Vue from 'vue'
import Router from 'vue-router'
import EventCreate from './views/EventCreate.vue'
import EventList from './views/EventList.vue'
import EventShow from './views/EventShow.vue'
import NProgress from 'nprogress'
import store from '@/store/store'
import NotFound from './views/NotFound.vue'
import NetworkIssue from './views/NetworkIssue.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'event-list',
      component: EventList,
      props: true
    },
    {
      path: '/event/create',
      name: 'event-create',
      component: EventCreate
    },
    {
      path: '/event/:id',
      name: 'event-show',
      component: EventShow,
      //router에서 props를 true로 설정하면 route.params가 컴포넌트의 props가 된다.
      props: true,
      //이동될 route에 hook을 걸어준다.
      beforeEnter(to, from, next) {
        store
          .dispatch('event/fetchEvent', to.params.id)
          .then(event => {
            to.params.event = event
            next()
          })
          //일치하는 event가 없어서 error인 경우 .catch()
          // next()에 404 페이지와 params를 담아서 이동시켜준다.
          .catch(error => {
            console.log(error)
            if (error.response && error.response.status == 404) {
              next({ name: '404', params: { resource: 'event' } })
            } else {
              next({ name: 'network-issue' })
            }
          })
      }
    },
    {
      path: '/404',
      name: '404',
      component: NotFound,
      props: true
    },
    {
      path: '/network-issue',
      name: 'network-issue',
      component: NetworkIssue
    },
    {
      //Will catch all navigation that doesn't match
      path: '*',
      //일치하는 path가 없는 경우 404 페이지로 이동시켜준다.
      redirect: { name: '404', params: { resource: 'page' } }
    }
  ]
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
