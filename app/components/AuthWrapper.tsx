import { FolderGit2 } from "lucide-react";

type WrapperProps = {
  children: React.ReactNode;
};

const AuthWrapper = ({ children }: WrapperProps) => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0 bg-cover bg-center z-0 bg-[url('/bg2.jpeg')] filter brightness-100" />

      {/* Couche bleue semi-transparente */}
      <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-sm z-10" />

      {/* Contenu centré */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full">
        {/* Logo et Titre */}
        <div className="flex items-center mb-6">
          <div className="bg-sky-500/50 text-blue-950 rounded-full p-2">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <span className="ml-2 text-3xl font-bold">
            Flow <span className="text-blue-800">Projet</span>
          </span>
        </div>

        {/* Formulaire Clerk avec transparence */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          {children}


        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;