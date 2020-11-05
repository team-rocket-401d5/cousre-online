'use strict';

const express = require('express');
const router = express.Router();

router.get('/',getPublicCourses);
//is this post or get??????
router.get('/addtocourse/:id', addToCourses);

function getPublicCourses(req,res){}
function addToCourses(req,res){}

module.exports = router;
