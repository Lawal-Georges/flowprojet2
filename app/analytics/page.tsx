"use client";

import { useUser } from "@clerk/nextjs";
import { getProjectsCreatedByUser, getProjectInfo } from "../actions";
import { useState, useEffect } from "react";
import { Project, Task } from "../../type";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { FolderGit2 } from "lucide-react";
import Wrapper from "../components/Wrapper";


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


interface ProjectWithTasks extends Project {
    tasks: Task[];
}


export default function AnalyticsPage() {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress as string;
    const [timeRange, setTimeRange] = useState<"day" | "week" | "month">("week");
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsWithTasks, setProjectsWithTasks] = useState<ProjectWithTasks[]>([]);

    useEffect(() => {
        if (email) {
            fetchProjects(email);
        }
    }, [email]);

    const fetchProjects = async (email: string) => {
        try {
            const myProjects = await getProjectsCreatedByUser(email);
            setProjects(myProjects);

            // Récupérer les détails de chaque projet
            const projectsWithTasksData = await Promise.all(
                myProjects.map(async (project) => {
                    const fullProject = await getProjectInfo(project.id, true);
                    return fullProject as ProjectWithTasks;
                })
            );

            setProjectsWithTasks(projectsWithTasksData.filter(Boolean));
        } catch (error) {
            console.error("Erreur lors du chargement des projets:", error);
        }
    };

    // Statistiques de création de projets
    const getProjectCreationData = () => {
        const now = new Date();
        const data: { name: string; projects: number }[] = [];

        if (timeRange === "day") {
            for (let i = 0; i < 24; i++) {
                const hour = i.toString().padStart(2, '0') + ':00';
                const count = projects.filter(p => {
                    const date = new Date(p.createdAt);
                    return date.getDate() === now.getDate() && date.getHours() === i;
                }).length;
                data.push({ name: hour, projects: count });
            }
        } else if (timeRange === "week") {
            const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dayName = days[date.getDay()];
                const count = projects.filter(p => {
                    const pDate = new Date(p.createdAt);
                    return pDate.toDateString() === date.toDateString();
                }).length;
                data.push({ name: dayName, projects: count });
            }
        } else {
            for (let i = 11; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthName = date.toLocaleString('default', { month: 'short' });
                const count = projects.filter(p => {
                    const pDate = new Date(p.createdAt);
                    return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear();
                }).length;
                data.push({ name: monthName, projects: count });
            }
        }

        return data;
    };

    // Statistiques des tâches
    const getTaskStatusData = () => {
        const statusCount = {
            'To Do': 0,
            'In Progress': 0,
            'Done': 0
        };

        projectsWithTasks.forEach(project => {
            project.tasks?.forEach(task => {
                statusCount[task.status as keyof typeof statusCount]++;
            });
        });

        return [
            { name: 'À faire', value: statusCount['To Do'] },
            { name: 'En cours', value: statusCount['In Progress'] },
            { name: 'Terminé', value: statusCount['Done'] }
        ];
    };

    const creationData = getProjectCreationData();
    const taskData = getTaskStatusData();

    return (
        <Wrapper>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold flex items-center whitespace-nowrap">
                        <FolderGit2 className="mr-2 w-5 text-primary h-5 sm:w-6 sm:h-6" />
                        Statistiques des projets
                    </h1>

                    <div className="join join-vertical sm:join-horizontal w-full sm:w-auto">
                        <button
                            className={`join-item btn btn-sm ${timeRange === 'day' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setTimeRange('day')}
                        >
                            <span className="hidden sm:inline">📅</span> Jour
                        </button>
                        <button
                            className={`join-item btn btn-sm ${timeRange === 'week' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setTimeRange('week')}
                        >
                            <span className="hidden sm:inline">📆</span> Semaine
                        </button>
                        <button
                            className={`join-item btn btn-sm ${timeRange === 'month' ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => setTimeRange('month')}
                        >
                            <span className="hidden sm:inline">🗓️</span> Mois
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Graphique de création de projets */}
                    <div className="card bg-base-100 p-6 shadow">
                        <h2 className="text-lg font-semibold mb-4">Projets créés</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={creationData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar
                                        dataKey="projects"
                                        name="Projets"
                                        fill="#4f46e5"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Graphique des statuts de tâches */}
                    <div className="card bg-base-100 p-6 shadow">
                        <h2 className="text-lg font-semibold mb-4">Statut des tâches</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={taskData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {taskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Statistiques résumées */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stats bg-primary text-primary-content">
                        <div className="stat">
                            <div className="stat-title">Projets totaux</div>
                            <div className="stat-value">{projects.length}</div>
                        </div>
                    </div>

                    <div className="stats bg-secondary text-secondary-content">
                        <div className="stat">
                            <div className="stat-title">Tâches totales</div>
                            <div className="stat-value">
                                {projectsWithTasks.reduce((acc, project) => acc + project.tasks.length, 0)}
                            </div>
                        </div>
                    </div>

                    <div className="stats bg-accent text-accent-content">
                        <div className="stat">
                            <div className="stat-title">Tâches terminées</div>
                            <div className="stat-value">
                                {projectsWithTasks.reduce((acc, project) =>
                                    acc + project.tasks.filter(t => t.status === 'Done').length, 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}