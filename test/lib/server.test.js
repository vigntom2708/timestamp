import request from 'supertest'
import moment from 'moment'
import test from 'ava'
import { server } from './../../lib/server'

test.cb('Empty Request', t => {
  request(server)
    .get('/api/')
    .expect('Content-Type', 'application/json')
    .expect(200)
    .end((err, res) => {
      t.true(err === null)
      t.true(res.body.unix === null)
      t.true(res.body.natural === null)
      t.end()
    })
})

test.cb('Wrong Request', t => {
  request(server)
    .get('/api/Wrong Request')
    .expect('Content-Type', 'application/json')
    .expect(200)
    .end((err, res) => {
      t.true(err === null)
      t.true(res.body.unix === null)
      t.true(res.body.natural === null)
      t.end()
    })
})

test.cb('Request with a unix timestamp', t => {
  const timestamp = Date.now()

  request(server)
    .get(`/api/${timestamp.valueOf()}`)
    .expect('Content-Type', 'application/json')
    .expect(200)
    .end((err, res) => {
      t.true(err === null)
      t.is(res.body.unix, timestamp.valueOf())
      t.is(res.body.natural, moment(timestamp).format('LL'))
      t.end()
    })
})

test.cb('Request with a natural timestamp', t => {
  const timestamp = Date.parse(moment(Date.now()).format('LL'))

  request(server)
    .get(`/api/${moment(timestamp).format('LL')}`)
    .expect('Content-Type', 'application/json')
    .expect(200)
    .end((err, res) => {
      t.true(err === null)
      t.is(res.body.unix, timestamp.valueOf())
      t.is(res.body.natural, moment(timestamp).format('LL'))
      t.end()
    })
})
