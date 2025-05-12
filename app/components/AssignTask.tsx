import { User } from '@/generated/prisma/client';
import React, { FC, useState } from 'react';
import UserInfo from './UserInfo';

interface AssignTaskProps {
    users: User[];
    projectId: string;
    onAssignTask: (user: User) => void;
}

const AssignTask: FC<AssignTaskProps> = ({ users, onAssignTask }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleAssign = (user: User) => {
        setSelectedUser(user);
        onAssignTask(user);
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        if (modal) {
            modal.close();
        }
    };

    return (
        <div className="w-full">


            {/* Ouverture du modal */}
            <div
                className="cursor-pointer border border-base-300 p-5 rounded-xl w-full"
                onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}
            >
                <UserInfo
                    role="Assigner à"
                    email={selectedUser?.email || "Personne"}
                    name={selectedUser?.name || ""}
                />
            </div>

            {/* Modal de sélection */}
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg mb-3">Choisissez un collaborateur</h3>
                    <div>
                        {users.map((user) => (
                            <div
                                onClick={() => handleAssign(user)}
                                key={user.id}
                                className="cursor-pointer border border-base-300 p-5 rounded-xl w-full mb-3"
                            >
                                <UserInfo
                                    role="Assigner à"
                                    email={user.email || ''}
                                    name={user.name || ''}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AssignTask;
