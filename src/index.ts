import express from 'express'
import cors from 'cors'

const app = express()

const corsMiddleWare = cors()
const jsonBodyMiddleware = express.json()

app.use(corsMiddleWare)
app.use(jsonBodyMiddleware)

const port = process.env.PORT || 3000

const db = {
  courses: [
    {id: 1, title: 'front-end developer'},
    {id: 2, title: 'back-end developer'},
    {id: 3, title: 'QA'},
    {id: 4, title: 'DevOps'}
  ]
}

app.get('/', (req, res) => {
  res.send('HELLO WORLD Yahaaa' )
})

app.get('/courses', (req, res) => {
  let foundCourses = db.courses

  if (req.query.title) {
    foundCourses = db.courses.filter(el => el.title.indexOf(req.query.title as string) > -1)
  }

  res.json(foundCourses)
})

app.get('/courses/:id', (req, res) => {
  const foundCourse = db.courses.find(el => el.id === +req.params.id)

  if (!foundCourse) {
    res.sendStatus(404)
    return
  }
  res.json(foundCourse)
})

app.post('/courses', (req, res) => {

  if (!req.body.title) {
    res.sendStatus(400)
    return
  }

  const createdCourse = {
    id: +(new Date()),
    title: req.body.title
  }

  db.courses.push(createdCourse)

  res.status(201).json(createdCourse)
})

app.delete('/courses/:id', (req, res) => {
  db.courses = db.courses.filter(el => el.id !== +req.params.id)
  console.log('delete', db.courses)
  res.sendStatus(204)
})

app.put('/courses/:id', (req, res) => {
  const foundCourse = db.courses.find(el => el.id === +req.params.id)

  if (!foundCourse || !req.body.title) {
    res.sendStatus(404)
    return
  }

  foundCourse.title = req.body.title

  res.json(foundCourse)
})

app.listen(port, () => {
  console.log('Application is working on the port ' + port)
})
