import { useBase, createRouter, defineEventHandler } from 'h3'
import * as userCtrl from '~~/server/controller/user'
import * as counterCtrl from '~~/server/controller/counter'
import * as adminCtrl from '~~/server/controller/admin'
import * as settingsCtrl from '~~/server/controller/settings'

const router = createRouter()

router.get('/user', defineEventHandler(userCtrl.read))
router.post('/user/regin', defineEventHandler(userCtrl.create))
router.post('/user/login', defineEventHandler(userCtrl.loginUser))

router.get('/counter/all-read', defineEventHandler(counterCtrl.readForCounterDateAndMain))
router.get('/counter/all-read-admin', defineEventHandler(counterCtrl.readForCounterDateAndMainAdmin))

router.get('/counter/user', defineEventHandler(counterCtrl.userForToken))
router.post('/counter/add', defineEventHandler(counterCtrl.create))

router.get('/admin/count', defineEventHandler(adminCtrl.read))
router.put('/admin/add-expenses', defineEventHandler(adminCtrl.addExpenses))
router.put('/admin/count', defineEventHandler(adminCtrl.updateCounterGeneralMain))
router.post('/admin/count/create', defineEventHandler(adminCtrl.closeMonthMain))
router.post('/admin/count/update-pay', defineEventHandler(counterCtrl.updateDataToPayForAdmin))

router.get('/settings', defineEventHandler(adminCtrl.read))

router.get('/auth', defineEventHandler(userCtrl.authToken))

export default useBase('/api', router.handler)