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
        <strong>Feedback:</strong> ${feedback}<hr>
    `;
    return feedbackElement;
}

//--Survey Function--
function populateSurvey(selection) {
    fetchSurvey()
        .then(data => {
            console.log('Data:', data);
            const surveyElement = document.getElementById('surveyData');

            const selectedSurvey = data.find(survey => {
                return (selection === 'student' && survey.id === 1) ||
                    (selection === 'bachelor' && survey.id === 2);
            });

            console.log('Selected Survey:', selectedSurvey);

            if (selectedSurvey) {
                fetchQuestion()
                    .then(questionData => {
                        console.log('Questions Data:', questionData);

                        const surveyContainer = createSurveyContainer(selectedSurvey, questionData);
                        surveyElement.appendChild(surveyContainer);
                    })
                    .catch(error => console.error('Error fetching JSON:', error));
            }
            /*if (selectedSurvey) {
                const surveyContainer = createSurveyContainer(selectedSurvey);
                surveyDataElement.appendChild(surveyContainer);
            }*/
        })
        .catch(error => console.error('Error fetching JSON:', error));
}

function createSurveyContainer(survey, questionData) {
    const surveyContainer = document.createElement('div');
    surveyContainer.innerHTML = `
        <h2>${survey.title}</h2>
        <p>${survey.desc}</p>
        <p>${survey.nq}</p>
        ${createQuestionList(survey.qs, questionData)}
        <hr>
    `;
    //<p>${survey.qs.join('<br>')}</p>
    return surveyContainer;
}

function createQuestionList(questionIds, questionData) {
    const questionsList = questionIds.map(questionId => {
        const question = questionData.find(q => q.id === parseInt(questionId));
        if (question) {
            return `<p>${question.title}</p>
                    <p>${question.description}</p><br>`;
        }
        return '';
    }).join('');

    return questionsList;
}