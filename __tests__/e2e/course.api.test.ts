import request from 'supertest'
import {app, CourseType} from '../../src'
import {CreateCourseModel} from "../../src/models/CreateCourseModel";
import {CourseViewModel} from "../../src/models/CourseViewModel";
import {UpdateCourseModel} from "../../src/models/UpdateCourseModel";

describe('/courses', () => {
  beforeAll(async () => {
    await request(app).delete('/__test__/data')
  })
  it('should return 200 and an empty array', async () => {
    await request(app).get('/courses').expect([])
  })

  it('should return 404 for not existing course', async () => {
    await request(app).get('/courses/412121').expect(404)
  })

  it(`shouldn't create a new course with incorrect title`, async() => {
    const data: CreateCourseModel = {title: ''};
    await request(app).post('/courses').send(data).expect(400)
    await request(app).get('/courses').expect([])
  })

  let createdCourse: CourseViewModel = {} as CourseViewModel
  it(`should create a new course with correct input data`, async() => {
    const data: CreateCourseModel = {title: 'IT-ICUBATOR COURSE'};
    const response = await request(app).post('/courses').send(data).expect(201)
    createdCourse = response.body

    expect(createdCourse).toEqual({
      title: data.title,
      id: expect.any(Number),
    })

    await request(app).get('/courses').expect([createdCourse])
  })

  it(`should update course with correct input data`, async() => {
    const data: UpdateCourseModel = {title: 'IT-ICUBATOR COURSE UPDATE'};
    const response = await request(app).put('/courses/' + createdCourse.id as string).send(data)

    createdCourse = response.body

    expect(createdCourse).toEqual({
      title: data.title,
      id: expect.any(Number),
      totalCount: expect.any(Number)
    })

    // await request(app).get('/courses').expect([createdCourse])
  })

  it(`shouldn't update course which not exist`, async () => {
    await request(app).put('/courses/212').send({title: 'IT-ICUBATOR COURSE UPDATE'}).expect(404)
  })

  it(`should delete course`, async () => {
    await request(app).delete('/courses/' + createdCourse.id as string).expect(204)
  })
})
