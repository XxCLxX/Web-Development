const surveyURL = 'https://my-json-server.typicode.com/depth0/survey1/surveys';
const questionUrl = 'https://my-json-server.typicode.com/depth0/survey1/questions';

async function fetchSurvey() {
    const response = await fetch(surveyURL);
    return await response.json();
}

async function fetchQuestion() {
    const response = await fetch(questionUrl);
    return await response.json();
}

//--Feedback Function--
function submitFeedback() {

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var feedback = document.getElementById("feedback").value;
    var selection = document.getElementById("selection").value;

    const feedbackElement = createFeedbackElement(name, email, selection, feedback);

    document.getElementById("userFeedback").appendChild(feedbackElement);
    document.getElementById("feedbackForm").reset();

    populateSurvey(selection);
}

function createFeedbackElement(name, email, selection, feedback) {
    const feedbackElement = document.createElement("div");
    feedbackElement.innerHTML = `
        <strong>Name:</strong> ${name}<br>
        <strong>Email:</strong> ${email}<br>
        <strong>Selection:</strong> ${selection}<br>
        <strong>Comment:</strong> ${feedback}<hr>
    `;
    return feedbackElement;
}

//--Survey Function--
function populateSurvey() {
    const selectOption = document.getElementById("selection").value;

    fetchSurvey()
        .then(data => {
            console.log('Data:', data);
            const surveyElement = document.getElementById('surveyData');

            const selectedSurvey = data.find(survey => {
                return (selectOption === 'student' && survey.id === 1) ||
                    (selectOption === 'bachelor' && survey.id === 2);
            });

            console.log('Selected Survey:', selectedSurvey);

            if (selectedSurvey) {
                fetchQuestion()
                    .then(questionData => {
                        console.log('Questions Data:', questionData);

                        const surveyContainer = createSurveyContainer(selectedSurvey, questionData);
                        surveyElement.innerHTML = '';
                        surveyElement.appendChild(surveyContainer);
                    })
                    .catch(error => console.error('Error fetching JSON:', error));
            }
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

function createSurveyContainer(survey, questionData) {
    const surveyContainer = document.createElement('div');
    surveyContainer.innerHTML = `
        <h2>${survey.title}</h2>
        <h3>${survey.desc}</h3>
        ${createQuestionList(survey.qs, questionData)}
        <hr>
    `;
    return surveyContainer;
}
//<p>${survey.nq}</p>

function createQuestionList(questionIds, questionData) {
    const questionsList = questionIds.map(questionId => {
        const question = questionData.find(q => q.id === parseInt(questionId));
        if (question) {
            return `
                <strong><label for="question${question.id}">${question.title}</label></strong>
                <p>${question.description}</p>
                ${createQuestionElement(question)}`
        }
        return '';
    }).join('');

    return questionsList;
}

function createQuestionElement(question) {
    if (question.type === 'rate') {
        return question.options.map(option => `
            <input type="radio" name="question${question.id}" value="${option}" id="question${question.id}-${option}">
            <label for="question${question.id}-${option}">${option}</label>
        `).join('');
    } else if (question.type === 'free') {
        return `<textarea name="question${question.id}" rows="4"></textarea>`;
    }
    return '';
}