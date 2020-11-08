'use strict';
const server = require('../lib/server.js').server;
const supertest = require('supertest');
const express = require('express');

const mockRequest = supertest(server);
const supergoose = require('@code-fellows/supergoose');

describe('api server courses', () => {
  it('POST to /signup to create a new user', async () => {
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

    // const response =res1.body.token

    expect(res1.status).toBe(201);
    expect(res3.text).toEqual('it\'s working');
  });
  //   it('should respond for post', async () => {
  //     jest.setTimeout(50000);
  //     let res1 = await mockRequest
  //       .post('/signup')
  //       .send({ username: 'bayan3', password: '123' });
  //     let res2 = await mockRequest.post('/signin').auth('bayan3', '123');
  //     let res3 = await mockRequest
  //       .get('/secret')
  //       .set('authorization', `bearer ${res2.body.token}`);
  //     let res4 = await mockRequest.post('/bayan3/course').send({
  //       playlist: {
  //         url:
  //           'https://www.youtube.com/playlist?list=PLRBp0Fe2GpglkzuspoGv-mu7B2ce9_0Fn',
  //         playlist_title: '💥 NCS: Indie Dance',
  //         description: 'All Indie Dance releases on NCS.',
  //         total_items: 14,
  //       },
  //       author: {
  //         name: 'NoCopyrightSounds',
  //         channel_url: 'https://www.youtube.com/channel/UC_aEa8K-EOJ3D6gOs7HcyNg',
  //       },
  //       watched_time: 0,
  //       sections: [
  //         {
  //           section_title: 'title 1',
  //           videos: [
  //             {
  //               video_id: 'xKKo7t72Tg',
  //               url_simple: 'https://www.youtube.com/watch?v=-xKKo7t72Tg',
  //               title: 'Itro & Kontinuum - Alive [NCS Release]',
  //               thumbnail: 'https://i.ytimg.com/vi/-xKKo7t72Tg/hqdefault.jpg',
  //               duration: '4:08',
  //               note: '',
  //               isWatched: false,
  //             },
  //             {
  //               video_id: 'xKKo7t72Tg',
  //               url_simple: 'https://www.youtube.com/watch?v=-xKKo7t72Tg',
  //               title: 'Itro & Kontinuum - Alive [NCS Release]',
  //               thumbnail: 'https://i.ytimg.com/vi/-xKKo7t72Tg/hqdefault.jpg',
  //               duration: '4:08',
  //               note: '',
  //               isWatched: false,
  //             },
  //           ],
  //         },
  //         {
  //           section_title: 'title 2',
  //           videos: [
  //             {
  //               video_id: 'xKKo7t72Tg',
  //               url_simple: 'https://www.youtube.com/watch?v=-xKKo7t72Tg',
  //               title: 'Itro & Kontinuum - Alive [NCS Release]',
  //               thumbnail: 'https://i.ytimg.com/vi/-xKKo7t72Tg/hqdefault.jpg',
  //               duration: '4:08',
  //               note: '',
  //               isWatched: false,
  //             },
  //             {
  //               video_id: 'xKKo7t72Tg',
  //               url_simple: 'https://www.youtube.com/watch?v=-xKKo7t72Tg',
  //               title: 'Itro & Kontinuum - Alive [NCS Release]',
  //               thumbnail: 'https://i.ytimg.com/vi/-xKKo7t72Tg/hqdefault.jpg',
  //               duration: '4:08',
  //               note: '',
  //               isWatched: false,
  //             },
  //           ],
  //         },
  //       ],
  //       user: 'bayan3',
  //     });
  //     const res = await mockRequest.get(`/bayan3/courses`);
  //     const response = [
  //       {
  //         playlist: {
  //           url:
  //             'https://www.youtube.com/playlist?list=PLRBp0Fe2GpglkzuspoGv-mu7B2ce9_0Fn',
  //           playlist_title: '💥 NCS: Indie Dance',
  //           description: 'All Indie Dance releases on NCS.',
  //           total_items: 14,
  //         },
  //         author: {
  //           name: 'NoCopyrightSounds',
  //           channel_url:
  //             'https://www.youtube.com/channel/UC_aEa8K-EOJ3D6gOs7HcyNg',
  //         },
  //         watched_time: 0,
  //         sections: [
  //           {
  //             section_title: 'title 1',
  //             videos: [
  //               {
  //                 video_id: 'xKKo7t72Tg',
  //                 url_simple: 'https://www.youtube.com/watch?v=-xKKo7t72Tg',
  //                 title: 'Itro & Kontinuum - Alive [NCS Release]',
  //                 thumbnail: 'https://i.ytimg.com/vi/-xKKo7t72Tg/hqdefault.jpg',
  //                 duration: '4:08',
  //                 note: '',
  //                 isWatched: false,
  //               },
  //               {
  //                 video_id: 'xKKo7t72Tg',
  //                 url_simple: 'https://www.youtube.com/watch?v=-xKKo7t72Tg',
  //                 title: 'Itro & Kontinuum - Alive [NCS Release]',
  //                 thumbnail: 'https://i.ytimg.com/vi/-xKKo7t72Tg/hqdefault.jpg',
  //                 duration: '4:08',
  //                 note: '',
  //                 isWatched: false,
  //               },
  //             ],
  //           },
  //           {
  //             section_title: 'title 2',
  //             videos: [
  //               {
  //                 video_id: 'xKKo7t72Tg',
  //                 url_simple: 'https://www.youtube.com/watch?v=-xKKo7t72Tg',
  //                 title: 'Itro & Kontinuum - Alive [NCS Release]',
  //                 thumbnail: 'https://i.ytimg.com/vi/-xKKo7t72Tg/hqdefault.jpg',
  //                 duration: '4:08',
  //                 note: '',
  //                 isWatched: false,
  //               },
  //               {
  //                 video_id: 'xKKo7t72Tg',
  //                 url_simple: 'https://www.youtube.com/watch?v=-xKKo7t72Tg',
  //                 title: 'Itro & Kontinuum - Alive [NCS Release]',
  //                 thumbnail: 'https://i.ytimg.com/vi/-xKKo7t72Tg/hqdefault.jpg',
  //                 duration: '4:08',
  //                 note: '',
  //                 isWatched: false,
  //               },
  //             ],
  //           },
  //         ],
  //         user: 'bayan3',
  //       },
  //     ];

//     expect(res.status).toBe(302);
//     expect(res.body).toEqual(response);
//   });
});
