const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4')

const app = express();

//Falando que para todas rotas vai entender json
app.use(express.json());

//Permite que qualquer front-end tenha acesso ao back-end //Por ser ambiente de desevolvimento
app.use(cors());

const projects = [];

//(Middleware) Interceptador de funções que mostra as rotas que estamos usando
function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next(); //Próximo middleware

    console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({
            error: 'Invalid project ID'
        });
    }

    return next();
}

app.use(logRequests);

//Só para funcionar com put ou delete
app.use('projects/id', validateProjectId);

app.get('/projects', (request, response) => {
    const { title } = request.query;

    //Filtro simples pela Query title
    const results = title ? projects.filter(project => project.title.includes(title))
        : projects;
    // console.log(title);
    // console.log(owner);

    return response.json(projects);
});

app.post('/projects', (request, response) => {
    const { title, owner } = request.body;
    const project = { id: uuid(), title, owner };

    projects.push(project);

    return response.json(project);
});

//:id para identificar que tem id
app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({
            error: "Project not found"
        })
    }

    const project = {
        id,
        title,
        owner
    };

    projects[projectIndex] = project;
    return response.json(projects);
});

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({
            error: "Project not found"
        })
    }

    //Método para retirar algo de array
    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

app.listen(3333, () => {
    console.log('Back-end started!');
});