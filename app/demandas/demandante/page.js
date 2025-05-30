"use client";

import { useEffect, useState } from "react";
import { deleteDemandante, getAllDemandantes } from "../services/demandanteService";
import DemandanteForm from "../components/DemandanteForm";
import 'material-icons/iconfont/material-icons.css';
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import Sidebar from "../components/SIdebar";

export default function Demandante() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter(); 
  useEffect(() => {
    // Verifica se o código está rodando no lado do cliente
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem("authenticated");
      setIsAuthenticated(authStatus === "true");

      // Se o usuário não estiver autenticado, redireciona para a página de login
      if (authStatus !== "true") {
        router.push('/auth');
      }
    }
  }, [router]); 

 
  const handleDeleteItem = async (id) => {
  // Exibe um alerta de confirmação
  const confirmDelete = window.confirm("Tem certeza que deseja excluir esse demandante?");
  
  if (!confirmDelete) return;

  try {
    const response = await deleteDemandante(id);

    if (response) {
      alert("demandante excluída com sucesso!");
      window.location.reload(); // Recarrega a página após a exclusão
    } else {
      alert("Erro ao excluir a demanda.");
    }
  } catch (error) {
    console.error("Erro ao excluir a demanda:", error);
    alert("Falha ao excluir a demanda.");
  }
};
  // Função para buscar demandantes
  const fetchItems = async () => {
    try {
      const response = await getAllDemandantes();
      setItems(response);
    } catch (error) {
      console.error("Erro ao buscar demandantes:", error);
      setItems([]); // Evita que a tabela quebre caso ocorra erro na API
    }
  };

  // Fechar modal e atualizar lista após cadastro
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchItems(); // Recarrega os dados
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="text-black flex-1 flex flex-col ml-64">
     <Sidebar></Sidebar> 

      {/* Seção Principal */}
      <div class="flex-1 flex flex-col">
       <main class="flex-1 p-4 bg-white rounded-lg ">
       <div class="flex justify-between items-center mb-4">
                    <p class="text-gray-600">Resultados encontrados</p>
                    <div class="flex space-x-2">
                    <button class="border rounded-lg py-2 px-4 flex items-center bg-blue-800 text-white" onClick={() => setIsModalOpen(true)}>
                            <span class="material-icons mr-2" >add</span> Adicionar Demandante
                        </button>
                        <button class="border rounded-lg py-2 px-4">
                            <span class="material-icons">view_list</span>
                        </button>
                        <button class="border rounded-lg py-2 px-4">
                            <span class="material-icons">view_module</span>
                        </button>
                    </div>
                </div>
         
         

          {/* Modal */}
          {isModalOpen && <DemandanteForm onClose={handleCloseModal} />}
          
   <div className="flex gap-4 text-black">
  <div className="flex-1 overflow-x-auto mt-2">
    <div className="flex flex-col gap-4 mt-2 text-black">
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {items.map((item) => (
            <div
              key={item.ID}
              className="rounded-lg p-4 shadow bg-white flex flex-col gap-2"
            >
              <div>
                <span className="text-gray-500 text-sm">Nome</span>
                <div className="text-gray-800 font-medium">{item.NM_DEMANDANTE}</div>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Sigla</span>
                <div className="text-gray-800 font-medium">{item.NM_SIGLA}</div>
              </div>
              <div className="flex justify-end">
                <button
                  id="delete"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => handleDeleteItem(item.ID)}
                >
                  <span className="material-icons">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 border p-4 rounded-xl">
          Nenhum demandante encontrado
        </div>
      )}
    </div>
  </div>
</div>


        </main>
      </div>
    </div>
  );
}
