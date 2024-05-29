import { useBase, createRouter, defineEventHandler } from 'h3'
import * as userCtrl from '~~/server/controller/user'
import * as counterCtrl from '~~/server/controller/counter'

const router = createRouter()

router.get('/user', defineEventHandler(userCtrl.read))
router.post('/user', defineEventHandler(userCtrl.create))

router.get('/counter', defineEventHandler(counterCtrl.read))
router.post('/counter', defineEventHandler(counterCtrl.create))

export default useBase('/api', router.handler)