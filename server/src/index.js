import admin from 'firebase-admin'
import Queue from 'firebase-queue'
import express from 'express'

const {
  FIREBASE_SERVICE_ACCOUNT_KEY,
  FIREBASE_DATABASE
} = process.env

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(new Buffer(FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString())
  ),
  databaseURL: FIREBASE_DATABASE
})

const AUTH_REF = admin.database().ref('authentication')

const QUEUES_REF = AUTH_REF.child('userWritable')
const MESSAGES_QUEUE_REF = QUEUES_REF.child('messages-queue')

const MESSAGES_REF = AUTH_REF.child('allMembers').child('messages')

const queue = new Queue(MESSAGES_QUEUE_REF, {sanitize: false}, function (data, progress, resolve, reject) {
  // Read and process task data
  progress(10)

  if (data.action === 'delete') {
    admin.auth().verifyIdToken(data.idToken)
      .then(decodedToken => {
        const uid = decodedToken.uid
        MESSAGES_REF.child(data.language).child(data.target).child('uid').once('value')
          .then(snapshot => {
            if (snapshot.val() === uid) {
              MESSAGES_REF.child(data.language).child(data.target).remove()
              MESSAGES_QUEUE_REF.child(data._id).remove()
              resolve()
            } else {
              MESSAGES_QUEUE_REF.child(data._id).remove()
              resolve()
            }
          })
      }).catch(() => reject())
  }

  if (data.action === 'edit') {
    admin.auth().verifyIdToken(data.idToken)
      .then(decodedToken => {
        const uid = decodedToken.uid
        MESSAGES_REF.child(data.language).child(data.messageID).child('uid').once('value').then(snapshot => {
          if (snapshot.val() === uid) {
            MESSAGES_REF.child(data.language).child(data.messageID).child('message').set(data.message.message)
            MESSAGES_REF.child(data.language).child(data.messageID).child('edit_date').set(data.message.date)
            resolve()
          } else {
            reject()
          }
        })
      }).catch(err => {
        console.log(err)
        reject()
      })
  }

  if (data.action === 'add') {
    admin.auth().verifyIdToken(data.idToken)
      .then(decodedToken => {
        const uid = decodedToken.uid
        data.message.uid = uid

        return MESSAGES_REF.child(data.language).child(data._id).set(data.message)
          .then(function () {
            progress(10)

            progress(20)
            MESSAGES_QUEUE_REF.child(data._id).remove()
          })
          .then(resolve)
          .catch(reject)
      })
  }
})

process.on('SIGINT', function () {
  console.log('Starting queue shutdown')
  queue.shutdown().then(function () {
    console.log('Finished queue shutdown')
    process.exit(0)
  })
})

const app = express()

app.get('/', (req, res) => {
  res.send(`<h1>Hello Universe!</h1>
    <h2>The current time is: ${new Date().toISOString()}!</h2>`)
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
