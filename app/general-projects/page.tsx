'use client';

import { useUser } from '@clerk/nextjs';
import { addUserToProject, getProjectsAssociatedWithUser } from 'app/actions';
import EmptyState from 'app/components/EmptyState';
import ProjectComponent from 'app/components/ProjectComponent';
import Wrapper from 'app/components/Wrapper';
import { SquarePlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Project } from 'type';

// Changement ici : utiliser "export default" au lieu de "export const"
const Page = () => {
  const { user } = useUser() // Récupérer l'email de l'utilisateur connecté
  const email = user?.primaryEmailAddress?.emailAddress as string
  const [inviteCode, setInviteCode] = useState('')
  const [associatedProjects, setAssociatedProjects] = useState<Project[]>([])

  const fetchProjects = async (email: string) => {
    try {

      const associated = await getProjectsAssociatedWithUser(email);
      setAssociatedProjects(associated);
    } catch {
      toast.error("Erreur lors du chargement des projets.");
    }
  }

  useEffect(() => {
    if (email) {
      fetchProjects(email); // Charger les projets associés à l'utilisateur connecté
    }
  }, [email]) // Utiliser l'email de l'utilisateur connecté pour charger les projets associés

  const handleSumit = async () => {

    try {

      if (inviteCode != '') {
        await addUserToProject(email, inviteCode);
        fetchProjects(email);
        setInviteCode(''); // Réinitialiser le champ de code d'invitation
        toast.success('Vous avez rejoint le projet avec succès !');
      } else {
        toast.error('Erreur lors de la tentative de rejoindre le projet.');
      }
    } catch {
      toast.error("Code invalide ou vous appartez déjà à ce projet.");
    }
  };

  return (
    <Wrapper>
      <div className='flex'>
        <div className='mb-4'>
          <input
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            type='text'
            placeholder="Code d'invitation"
            className='w-full p-2 input input-bordered'
          />
        </div>
        <button className='btn btn-primary ml-4' onClick={handleSumit}>
          Rejoindre <SquarePlus className='w-4' />
        </button>
      </div>
      <div className='mt-4'>
        {associatedProjects.length > 0 ? (
          <ul className="w-full grid md:grid-cols-3 gap-6">
            {associatedProjects.map((project) => (
              <li key={project.id}>
                <ProjectComponent
                  project={project}
                  admin={0}
                  style={true}

                ></ProjectComponent>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <EmptyState
              imageSrc="/empty-project.png"
              imageAlt="Picture of an empty project"
              message="Aucun projet associé"
            />
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default Page;