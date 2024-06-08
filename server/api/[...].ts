import { useBase, createRouter, defineEventHandler } from 'h3'
import * as userCtrl from '~~/server/controller/user'
import * as counterCtrl from '~~/server/controller/counter'
import * as adminCtrl from '~~/server/controller/admin'

const router = createRouter()

router.get('/user', defineEventHandler(userCtrl.read))
router.post('/user/regin', defineEventHandler(userCtrl.create))
router.post('/user/login', defineEventHandler(userCtrl.loginUser))

router.get('/counter', defineEventHandler(counterCtrl.read))
router.get('/counter/user', defineEventHandler(counterCtrl.userForToken))
router.post('/counter/add', defineEventHandler(counterCtrl.create))

router.get('/admin/count', defineEventHandler(adminCtrl.read))
router.put('/admin/count', defineEventHandler(adminCtrl.updateCounterGeneralMain))

export default useBase('/api', router.handler)