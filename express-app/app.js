//import express from 'express';
//import surveys from './data/surveys.json';
//import questions from './data/questions.json';

const express = require('express');
const { find } = require('lodash');
const surveys = require('./data/surveys.json');
const questions = require('./data/questions.json');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello World!");
});

app.get('/surveys', (req, res) => {
  res.json(surveys);
});

app.get('/questions', (req, res) => {
  res.json(questions);
});

app.get('/surveys/:id', (req, res) => {
  const surveyId = parseInt(req.params.id);
  const survey = surveys.find((s) => s.id === surveyId);

  if (survey) {
    res.json(survey);
  } else {
    res.status(404).json({ error: 'Survey not found' });
  }
});

app.get('/questions/:id', (req, res) => {
  const questionId = parseInt(req.params.id);
  const question = find(questions, (q) => q.id === questionId);

  if (question) {
    res.json(question);
  } else {
    res.status(404).json({ error: 'Question not found' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});