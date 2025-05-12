"use client";

import { FolderGit2 } from "lucide-react";
import Wrapper from "./components/Wrapper";
import {
  createProject,
  deleteProjectById,
  getProjectsCreatedByUser,
} from "./actions";
import { useUser } from "@clerk/nextjs";

import { useState, useEffect } from "react"; // <-- directement React
import { toast } from "react-toastify";
import { Project } from "../type"; // Ajuste selon ton projet
import ProjectComponent from "./components/ProjectComponent";
import EmptyState from "./components/EmptyState";

export default function Home() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async (email: string) => {
    try {
      const myproject = await getProjectsCreatedByUser(email);
      setProjects(myproject);
      console.log(myproject);
    } catch (error) {
      console.error("Erreur lors du chargement des projets:", error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchProjects(email);
    }
  }, [email]);

  const deleteProject = async (projectId: string) => {
    try {
      await deleteProjectById(projectId);
      fetchProjects(email);
      toast.success("Projet supprimé !");
    } catch (error) {
      throw new Error("Error deleting proct: " + error);
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // <-- empêche le reload de la page

    try {
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      await createProject(name, description, email);

      if (modal) {
        modal.close();
      }
      setName("");
      setDescription("");
      toast.success("Projet créé avec succès");
      fetchProjects(email); // <-- recharge la liste après création
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Wrapper>
      <div>
        {/* Bouton pour ouvrir la modale */}
        <button
          className="btn btn-primary mb-6"
          onClick={() =>
            (
              document.getElementById("my_modal_3") as HTMLDialogElement
            ).showModal()
          }
        >
          Nouveau Projet <FolderGit2 />
        </button>

        {/* Modale */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>

            <h3 className="font-bold text-lg">Nouveau Projet</h3>
            <p className="py-4">
              Décrivez votre projet simplement grâce à la description
            </p>

            <div>
              <input
                placeholder="Nom du projet"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-base-300 input input-bordered w-full mb-4 placeholder:text-sm"
                required
              />
              <textarea
                placeholder="Description du projet"
                value={description}
                rows={4}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-2 textarea textarea-bordered w-full border-base-300 border textarea-md placeholder:text-sm"
                required
              />
              <button className="btn btn-primary mt-2" onClick={handleSubmit}>
                Créer Projet <FolderGit2 />
              </button>
            </div>
          </div>
        </dialog>

        {/* Liste des projets */}
        <div className="w-full">
          {projects.length > 0 ? (
            <ul className="w-full grid md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <li key={project.id}>
                  <ProjectComponent
                    project={project}
                    admin={1}
                    style={true}
                    onDelete={() => deleteProject(project.id)}
                  ></ProjectComponent>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <EmptyState
                imageSrc="/empty-project.png"
                imageAlt="Picture of an empty project"
                message="Aucun projet trouvé. Créez un nouveau projet pour commencer !"
              />
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
