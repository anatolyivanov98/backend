import express, { Request, Response } from 'express'
import cors from 'cors'

import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, ResponseWithQuery} from "./types";
import {CreateCourseModel} from "./models/CreateCourseModel";
import {UpdateCourseModel} from "./models/UpdateCourseModel";
import {QueryCoursesModel} from "./models/QueryCoursesModel";
import {CourseViewModel} from "./models/CourseViewModel";
import {URIParamsCourseIdModel} from "./models/URIParamsCourseIdModel";

export const app = express()

const corsMiddleWare = cors()
const jsonBodyMiddleware = express.json()

app.use(corsMiddleWare)
app.use(jsonBodyMiddleware)

const port = process.env.PORT || 3000

export type CourseType =  {
  id: number,
  title: string,
  totalCount: number
}

const db: { courses: CourseType[] } = {
  courses: [
    {id: 1, title: 'front-end developer', totalCount: 10},
    {id: 2, title: 'back-end developer', totalCount: 10},
    {id: 3, title: 'QA', totalCount: 10},
    {id: 4, title: 'DevOps', totalCount: 10}
  ]
}

const getCourseViewModel = (course: CourseType): CourseViewModel => {
  return {
    id: course.id,
    title: course.title
  }
}

app.get('/', (req, res) => {
  res.send('HELLO WORLD Add types and tests' )
})

app.get('/courses', (req: ResponseWithQuery<QueryCoursesModel>, res: Response) => {
  let foundCourses = db.courses

  if (req.query.title) {
    foundCourses = db.courses.filter(el => el.title.indexOf(req.query.title) > -1)
  }

  res.json(foundCourses.map(getCourseViewModel))
})

app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response<CourseViewModel>) => {
  const foundCourse = db.courses.find(el => el.id === +req.params.id)

  if (!foundCourse) {
    res.sendStatus(404)
    return
  }
  res.json(getCourseViewModel(foundCourse))
})

app.post('/courses', (req: RequestWithBody<CreateCourseModel>, res: Response) => {

  if (!req.body.title) {
    res.sendStatus(400)
    return
  }

  const createdCourse: CourseType = {
    id: +(new Date()),
    title: req.body.title,
    totalCount: 1
  }

  db.courses.push(createdCourse)

  res.status(201).json(getCourseViewModel(createdCourse))
})

app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res: Response) => {
  db.courses = db.courses.filter(el => el.id !== +req.params.id)
  res.sendStatus(204)
})

app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel, UpdateCourseModel>, res: Response) => {
  const foundCourse = db.courses.find(el => el.id === +req.params.id)

  if (!foundCourse || !req.body.title) {
    res.sendStatus(404)
    return
  }

  foundCourse.title = req.body.title

  res.json(foundCourse)
})

app.delete('/__test__/data', (req, res) => {
  db.courses = []

  res.sendStatus(204)
})

app.listen(port, () => {
  console.log('Application is working on the port ' + port)
})
