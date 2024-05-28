import { useBase, createRouter, defineEventHandler } from 'h3'
import * as userCtrl from '~~/server/controller/user'

const router = createRouter()

router.get('/user', defineEventHandler(userCtrl.read))
router.post('/user', defineEventHandler(userCtrl.create))

export default useBase('/api', router.handler)