import { PrismaClient } from '@/generated/prisma'; // <- ici corrigé avec le bon chemin
// Removed duplicate and incorrect import of PrismaClient
import type { Prisma } from '@/generated/prisma';

type User = Prisma.UserCreateInput;
import type { Project as PrismaProject, Task as PrismaTask } from '@/generated/prisma'; // Adjust the path if necessary

function prismaClientSingleton() {
  return new PrismaClient();
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;// Fusion du type PrismaProject avec vos propriétés supplémentaires


export type Project = PrismaProject & {
    totalTasks?: number;
    collaboratorsCount?: number;
    taskStats?: {
        toDo: number;
        inProgress: number;
        done: number;
    };
    percentages?: {
        progressPercentage: number;
        inProgressPercentage: number;
        toDoPercentage: number;
    };
    tasks?: Task[]; // Assurez-vous que la relation tasks est incluse
    users?: User[];
    createdBy?: User;
};

export type Task = PrismaTask & {
    user?: User | null;
    createdBy?: User | null;
};

