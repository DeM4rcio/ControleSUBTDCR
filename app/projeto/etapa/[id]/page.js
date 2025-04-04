"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getItemById } from "@/app/projeto/services/projetoService";
import { getAllEtapas, getAllItems } from "@/app/projeto/services/etapaSevice";
import {  getLastAnalise } from "@/app/projeto/services/analiseService"; 
import 'material-icons/iconfont/material-icons.css';
import Header from "@/app/demandas/components/Header";
import { EtapaForm } from "@/app/projeto/components/EtapaForm";
import AnaliseModal, { AnaliseForm } from "@/app/projeto/components/AnaliseForm";
import { FaTrash, FaEdit , FaPlus, FaEye} from 'react-icons/fa';
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto"; 
import { DesempenhoForm } from "@/app/projeto/components/DesempenhoForm";
import { CornerDownLeft } from "lucide-react";

export default function ProductPage() {
    const { id } = useParams(); 
    const [projeto, setProjeto] = useState({});
    const [etapas, setEtapas] = useState([]);
    const [etapaSelecionada, setEtapaSelecionada] = useState(null);
    const [ultimaAnalise, setUltimaAnalise] = useState({}); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDesempenho, setShowDesempenho] = useState(false)
    const [showAnalise, setShowAnalise] = useState(false)
    const [exec, setExec] = useState(0)
    const [plan, setPlan] = useState(0)
    

const dataGraph = {
    labels: ["Planejado", "Executado"],
    datasets: [
      {
        label: "Valores",
        data: [plan, exec],
        backgroundColor: ["#6366F1", "#0F9307"],
        borderColor: ["#4F46E5", "#D97706"],
        borderWidth: 1,
        barThickness: 125, // Ajuste a largura da barra aqui
      },
    ],
  };

  // Configuração do gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
useEffect(() => {
    const fetchProjeto = async () => {
        const response = await getItemById(id);
        console.log(response)
        setProjeto(response);
    };

    const fetchEtapas = async () => {
      const response = await getAllEtapas(id);
      setEtapas(response)
    }
    fetchProjeto();
    fetchEtapas();
}, [id]);



useEffect(() => {
    const fetchAnalises = async () => {
     
        const lastAnalise = await getLastAnalise(id);
        setUltimaAnalise(lastAnalise)
        
    };

    if (id) {
        fetchAnalises();
    }
}, [id]);



const handleCadastroEtapa = (novaEtapa) => {
    setEtapas((prevEtapas) => [...prevEtapas, novaEtapa]);
    setIsModalOpen(false);
};


  

    return (
        <>
       <Header />
<div className="bg-gray-100 ">
    {/* Container Centralizado */}
    <div className="max-w-7xl mx-auto flex ">
        {/* Sidebar */}





        {/* Modal de cadastro */}
        <EtapaForm
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCadastroEtapa}
            id={id}
        />
        <DesempenhoForm
            isOpen={showDesempenho}
            onClose={() => setShowDesempenho(false)}
            etapa={etapaSelecionada}
        />
        <AnaliseModal
            isOpen={showAnalise}
            onClose={() => setShowAnalise(false)}
            nomeProjeto ={id}
        />
        {/* Conteúdo Principal */}
        <main className="flex-1 p-6 bg-white rounded-lg shadow-md">
            {/* Detalhes do Projeto */}
            <div className="p-6 rounded-lg shadow-md mb-6">
      <h1 className="text-2xl font-bold mb-6">
        Informações sobre o projeto {projeto.NM_PROJETO}
      </h1>
      <div className="grid grid-cols-2 gap-10">
        {/* Informações do projeto */}
        <div className="space-y-4">
          <div>
            <p className="text-gray-800 font-semibold">Responsável pelo Projeto:</p>
            <p className="text-gray-600">{projeto.GERENTE_PROJETO}</p>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Unidade:</p>
            <p className="text-gray-600">{projeto.UNIDADE}</p>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Número do Processo SEI:</p>
            <p className="text-gray-600">{projeto.NR_PROCESSO_SEI}</p>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Área Demandante:</p>
            <p className="text-gray-600">{projeto.NM_AREA_DEMANDANTE}</p>
          </div>
          <div>
            <p className="text-gray-800 font-semibold">Última Ánalise:</p>
            <p className="text-gray-600">{ultimaAnalise.analise}</p>
          </div>
        </div>

        {/* Gráfico */}
        <div className="h-64 w-full">
           <div className="flex justify-end">
  <button
    onClick={() => {
      setShowAnalise(true);
    }}
    className="px-4 py-2 bg-[rgb(15,147,7)] text-white rounded-md"
  >
    Nova análise do projeto
  </button>
</div>

          <Bar className={"pt-10"} data={dataGraph} options={options} />
        </div>
      </div>
    </div>
            <div>
                 <div onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg shadow-md mt-4">
                  <FaPlus className="text-blue-500 text-xl" />
                  <span className="text-gray-700">Inserir Etapa ao projeto</span>
              </div>
                <table className="w-full border-collapse border">
                          <thead>
                              <tr className="bg-gray-50">
                                  <th className="border p-2 text-left">Nome da etapa</th>
                                  <th className="border p-2 text-left">Responsável pela Etapa</th>
                                  <th className="border p-2 text-left">Ínicio Planejado </th>
                                  <th className="border p-2 text-left">Termino Planejado</th>
                                  <th className="border p-2 text-left">Ínicio Real</th>
                                  <th className="border p-2 text-left">Termino Real</th>
                                  <th className="border p-2 text-left">Situação</th>
                                  <th className="border p-2 text-left">% Planejado</th>
                                  <th className="border p-2 text-left">% Executado</th>
                                  <th className="border p-2 text-left">Ação</th>
                              </tr>
                          </thead>
                          <tbody>
                              {etapas.map((item) => (
                                  <tr key={item.EtapaProjetoId} className="shadow">
                                      <td className="border p-2">{item.NM_ETAPA}</td>
                                      <td className="border p-2">{item.RESPONSAVEL_ETAPA}</td>
                                      <td className="border p-2">
                                        {
                                          item.DT_INICIO_PREVISTO ? 
                                    new Date(item.DT_INICIO_PREVISTO).toLocaleDateString('pt-BR') : 
                                    'Data não disponível'
                                }
                                      </td>
                                      <td className="border p-2">

                                      {
                                      
                                        item.DT_TERMINO_PREVISTO ? 
                                    new Date(item.DT_TERMINO_PEVISTO).toLocaleDateString('pt-BR') : 
                                    'Data não disponível'
                }  
                                      </td>
                
                                      <td className="border p-2">
                                        {
                                         
                                         item.DT_INICIO_REAL ? 
                                    new Date(item.DT_INICIO_REAL).toLocaleDateString('pt-BR') : 
                                    'Data não disponível'
                                        }

                                      </td>
                                      <td className="border p-2">
                                    {
                                    item.DT_TERMINO_REAL ? 
                                    new Date(item.DT_TERMINO_REAL).toLocaleDateString('pt-BR') : 
                                    'Data não disponível'
                                     }
                                    </td>
                                     <td className="border p-2">
                                    {
                                    item.SITUACAO
                                     }
                                    </td>
                                    <td className="border p-2">
  {(() => {
    const parseDate = (dateString) => {
      if (!dateString || dateString === "undefined" || dateString === "null") {
    return null; // Retorna null caso o dateString seja inválido
  }
      const [day, month, year] = dateString.split('-');
      return new Date(year, month - 1, day); // mês começa em 0 no JavaScript
    };

    const dtInicioPrevisto = parseDate(item.DT_INICIO_PREVISTO);
    const dtTerminoPrevisto = parseDate(item.DT_TERMINO_PREVISTO);

    // Calculando a diferença em dias
    const removeTime = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0); // Define a hora para 00:00:00
    return newDate;
};

// Calcule a diferença considerando apenas o dia

    const diffDays = (dtTerminoPrevisto - dtInicioPrevisto) / (1000 * 3600 * 24);
 
    if (diffDays > 0) {
      const diffToday = (removeTime(new Date()) - dtInicioPrevisto) / (1000 * 3600 * 24);
      return ((diffToday * 100) / diffDays).toFixed(2); // Calcula a porcentagem e formata com 2 casas decimais
    }

    return 0;
  })()}
</td>
<td className="border p-2">
    {
        item.PERCENT_EXEC_REAL
    }
</td>

                                    <td className="border p-2">
                                        {
                                            <button
                            onClick={() => {
                                setEtapaSelecionada(item)
                                setShowDesempenho(true)}
                            }
                            className="px-4 py-2   rounded-md "
                        >
                            <span className="material-icons ">sync</span>
                        </button>
                                        }
                                    </td>

                                     
                                  </tr>
                              ))}
                          </tbody>
                      </table>
            </div>

        
                
        </main>
    </div>
</div>

        </>
    );
}