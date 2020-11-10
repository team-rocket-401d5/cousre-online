'use strict';
const { server } = require('../lib/server.js');
const test2 = require('./testvideo.js');
const supertest = require('supertest');
const mockRequest = supertest(server);
require('@code-fellows/supergoose');

describe('api server courses', () => {
  it('Creates a new user', async () => {
    jest.setTimeout(50000);
    let res1 = await mockRequest
      .post('/signup')
      .send({ username: 'bayan', password: '123' });
    const response = res1.body.token;
    expect(res1.status).toBe(201);
    expect(res1.body.token).toEqual(response);
  });

  it('POST to /signin to create a new user', async () => {
    jest.setTimeout(500000);
    let res1 = await mockRequest
      .post('/signup')
      .send({ username: 'bayan1', password: '123' });
    let res2 = await mockRequest.post('/signin').auth('bayan1', '123');
    const response = res1.body.token;
    expect(res1.status).toBe(201);
    expect(res2.body.token).toEqual(response);
  });

  it('get to /secret to login as a user (use baerer auth)', async () => {
    jest.setTimeout(500000);
    let res1 = await mockRequest
      .post('/signup')
      .send({ username: 'bayan2', password: '123' });
    let res2 = await mockRequest.post('/signin').auth('bayan2', '123');
    let res3 = await mockRequest
      .get('/secret')
      .set('authorization', `bearer ${res2.body.token}`);
    expect(res1.status).toBe(201);
    expect(res3.text).toEqual('it\'s working');
  });

  it('should respond for post', async () => {
    jest.setTimeout(50000);
    await mockRequest
      .post('/signup')
      .send({ username: 'bayan3', password: '123' });
    let res2 = await mockRequest.post('/signin').auth('bayan3', '123');
    await mockRequest
      .get('/secret')
      .set('authorization', `bearer ${res2.body.token}`);
    let res4 = await mockRequest
      .post('/user/bayan3/course')
      .send(test2)
      .set('authorization', `bearer ${res2.body.token}`);
    const res5 = await mockRequest
      .get(`/user/bayan3/courses`)
      .set('authorization', `bearer ${res2.body.token}`);
    let res6 = await mockRequest
      .get(`/user/bayan3/courses/${res4.body._id}`)
      .set('authorization', `bearer ${res2.body.token}`);
    let res13 = await mockRequest
      .post(`/user/bayan3/courses/${res4.body._id}`)
      .send(test2)
      .set('authorization', `bearer ${res2.body.token}`);
    let res7 = await mockRequest
      .put(`/user/bayan3/courses/${res4.body._id}`)
      .send({
        playlist: {
          url:
            'https://www.youtube.com/playlist?list=PLRBp0Fe2GpglkzuspoGv-mu7B2ce9_0Fn',
          playlist_title: '💥 NCS: Indie Dance',
          description: 'All Indie Dance releases on NCS.',
          thumbnail: 'https://i.ytimg.com/vi/YwP4NAZGskg/mqdefault.jpg',
        },
        author: {
          name: 'NoCopyrightSounds',
          channel_url:
            'https://www.youtube.com/channel/UC_aEa8K-EOJ3D6gOs7HcyNg',
        },
        watched_time: 0,
        sections: [
          {
            section_title: 'title 1',
            videos: [
              {
                video_id: 'bayan',
                url_simple: 'https://www.youtube.com/watch?v=-xKKo7t72Tg',
                title: 'Itro & Kontinuum - Alive [NCS Release]',
                thumbnail: 'https://i.ytimg.com/vi/-xKKo7t72Tg/hqdefault.jpg',
                duration: '4:08',
                note: '',
                isWatched: false,
              },
              {
                video_id: 'xKKo7t72Tg',
                url_simple: 'https://www.youtube.com/watch?v=-xKKo7t72Tg',
                title: 'Itro & Kontinuum - Alive [NCS Release]',
                thumbnail: 'https://i.ytimg.com/vi/-xKKo7t72Tg/hqdefault.jpg',
                duration: '4:08',
                note: '',
                isWatched: false,
              },
            ],
          },
          {
            section_title: 'title 2',
            videos: [
              {
                video_id: 'xKKo7t72Tg',
                url_simple: 'https://www.youtube.com/watch?v=-xKKo7t72Tg',
                title: 'Itro & Kontinuum - Alive [NCS Release]',
                thumbnail: 'https://i.ytimg.com/vi/-xKKo7t72Tg/hqdefault.jpg',
                duration: '4:08',
                note: '',
                isWatched: false,
              },
              {
                video_id: 'xKKo7t72Tg',
                url_simple: 'https://www.youtube.com/watch?v=-xKKo7t72Tg',
                title: 'Itro & Kontinuum - Alive [NCS Release]',
                thumbnail: 'https://i.ytimg.com/vi/-xKKo7t72Tg/hqdefault.jpg',
                duration: '4:08',
                note: '',
                isWatched: false,
              },
            ],
          },
        ],
        user: 'bayan3',
      })
      .set('authorization', `bearer ${res2.body.token}`);
    let res10 = await mockRequest
      .get(`/user/bayan3/courses/${res4.body._id}/bayan`)
      .set('authorization', `bearer ${res2.body.token}`);

    let res11 = await mockRequest
      .patch(`/user/bayan3/courses/${res4.body._id}/bayan/isWatched`)
      .set('authorization', `bearer ${res2.body.token}`);
    let res12 = await mockRequest
      .patch(`/user/bayan3/courses/${res4.body._id}/bayan/notes`)
      .set('authorization', `bearer ${res2.body.token}`)
      .send({ note: 'course' });
    let res14 = await mockRequest
      .post(`/public/addtocourse/${res13.body._id}`)
      .send({ username: 'bayan3' })
      .set('authorization', `bearer ${res2.body.token}`);
    let res15 = await mockRequest.get(`/public`);
    let res16 = await mockRequest.get(`/public/${res15.body[0]._id}`);
    let res18 = await mockRequest.get(`/public/kxlk`);
    let res19 = await mockRequest.get('/playlist').send({
      playlist:
        'https://www.youtube.com/playlist?list=PLDoPjvoNmBAyXCAQMLhDRZsLi_HurqTBZ',
    });
    console.log(res19);
    let res8 = await mockRequest
      .delete(`/user/bayan3/courses/${res13.body._id}`)
      .set('authorization', `bearer ${res2.body.token}`);
      console.log(res12,res11);
    let res9 = await mockRequest
      .get(`/user/bayan3/courses`)
      .set('authorization', `bearer ${res2.body.token}`);
    expect(res5.status).toBe(302);
    // expect(res4.status).toBe(302);
    // expect(res6.status).toBe(302);
    // expect(res11.status).toBe(200);
    // expect(res12.status).toBe(200);
    // expect(res13.status).toBe(302);
    // expect(res14.status).toBe(202);
    // expect(res15.status).toBe(200);
    // expect(res16.status).toBe(202);
    // expect(res8.status).toBe(202);
    // expect(res18.status).toBe(404);
    // expect(res19.status).toBe(200);


    // expect(res4.body._id).toEqual(res5.body[0]._id);
    // expect(res6.body[0].section_title).toEqual(res4.body.sections[0].section_title);
    // expect(res7.body.sections[0].videos.length).toEqual(2);
    // expect(res10.body.video_id).toEqual('bayan');
    // expect(res13.body).not.toEqual(null);

    // expect(res11.body.sections[0].videos[0].isWatched).toEqual(true);
    // expect(res12.body.sections[0].videos[0].note).toEqual('course');
    // expect(res15.body[0].publisher).toEqual('bayan3');
    // expect(res16.body._id).toEqual(`${res15.body[0]._id}`);

    // expect(res9.body.length).toEqual(2);
  });
});
