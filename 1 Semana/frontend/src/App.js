import React, { useState, useEffect } from "react";
import api from './services/api';

import './App.css';

import Header from "./components/Header";

function App() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        //then por ser assincrona, quando retornar algo *então* faz algo
        api.get('/projects').then(response => {
            setProjects(response.data);
        })
    }, []);

    async function handleAddProject() {
        const response = await api.post('projects', {
            title: `Novo projeto ${Date.now()}`,
            owner: "Lucas"
        })

        const project = response.data;

        setProjects([...projects, project]);

        console.log(projects);
    }

    return (
        <div>
            <Header title="Componente 1" />

            <ul>
                {projects.map(projects => <li key={projects.id}>{projects.title}</li>)}
            </ul>
            <button type="button" onClick={handleAddProject}>Adicionar projeto</button>
        </div>
    );
}

export default App;