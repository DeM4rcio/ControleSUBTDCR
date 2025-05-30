"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getItemById } from "@/app/projeto/services/projetoService";
import { getAllEtapas, getAllItems, getPercent } from "@/app/projeto/services/etapaSevice";
import { getLastAnalise } from "@/app/projeto/services/analiseService";
import 'material-icons/iconfont/material-icons.css';
import Header from "@/app/demandas/components/Header";
import { EtapaForm } from "@/app/projeto/components/EtapaForm";
import AnaliseModal, { AnaliseForm } from "@/app/projeto/components/AnaliseForm";
import { FaTrash, FaEdit, FaPlus, FaEye } from 'react-icons/fa';
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { DesempenhoForm } from "@/app/projeto/components/DesempenhoForm";
import { CornerDownLeft } from "lucide-react";
import InicioEtapa from "../../components/InicioForm";
import { useRouter } from "next/navigation";
import dayjs from 'dayjs'
import Sidebar from "../../components/Sidebar";
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
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
  const [ocupado, setOcupado] = useState(false);
  const [showModalInicio, setShowModalInicio] = useState(false);

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

      setProjeto(response);
    };

    const fetchEtapas = async () => {
      const response = await getAllEtapas(id);
      
      const etapasOrdenadas = response.sort((a, b) => a.Order - b.Order);
      console.log(etapasOrdenadas)
      setEtapas(etapasOrdenadas);
    
      const total = etapasOrdenadas.reduce(
        (soma, etapa) => soma + (etapa.PERCENT_TOTAL_ETAPA || 0),
        0
      );
    
      setOcupado(Math.round(total) > 99);
    };
     

    const fectPercent = async () => {
      const response = await getPercent(id)
      setExec(response.PERCENT_EXECUTADO)
      setPlan(response.PERCENT_PLANEJADO)
    }

    fectPercent();
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

<div className="bg-white flex-1 flex flex-col ml-64">
        <Sidebar></Sidebar>
        {/* Container Centralizado */}
        <div class="flex-1 flex flex-col">
        <div className="flex-1 p-4 bg-white rounded-lg ">
          {/* Sidebar */}
          <InicioEtapa
            isOpen={showModalInicio}
            onClose={() => setShowModalInicio(false)}
            etapa={etapaSelecionada}
          />
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
            nomeProjeto={id}
          />
          {/* Conteúdo Principal */}
          <main className="overflow-x-auto">
            {/* Detalhes do Projeto */}
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-6">
               {projeto.NM_PROJETO}
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
                    <p className="text-gray-600">{ultimaAnalise.ANALISE}</p>
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
              {!ocupado && (
                <div
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 bg-gray-100 p-4 rounded-lg shadow-md mt-4"
                >
                  <FaPlus className="text-blue-500 text-xl" />
                  <span className="text-gray-700">Inserir Etapa ao projeto</span>
                </div>
              )}

              <table className="w-full border-collapse ">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className=" text-left text-gray-600 p-3">Nome da etapa</th>

                    <th className=" text-left text-gray-600 p-3">Ínicio Planejado </th>
                    <th className=" text-left text-gray-600 p-3">Termino Planejado</th>
                    <th className=" text-left text-gray-600 p-3">Ínicio Real</th>
                    <th className=" text-left text-gray-600 p-3">Termino Real</th>
                    <th className=" text-left text-gray-600 p-3">Situação</th>
                    <th className=" text-left text-gray-600 p-3">% Planejado</th>
                    <th className=" text-left text-gray-600 p-3">% Executado</th>
                    <th className=" text-left text-gray-600 p-3">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    !Array.isArray(etapas) ? (
                      <tr className="border-b hover:bg-gray-50">
                        <td colSpan="100%" className="text-center p-4 text-gray-500">
                          Este projeto não contém etapas.
                        </td>
                      </tr>
                    ) : Array.isArray(etapas) &&
                    etapas
                      .slice()
                      .map((item) => (
                        <tr key={item.EtapaProjetoId} className="border-b hover:bg-gray-50">
                          <td className=" p-3">{item.NM_ETAPA}</td>
                          <td className=" p-3">
                            {
                              item.DT_INICIO_PREVISTO ?
                                new Date(item.DT_INICIO_PREVISTO).toLocaleDateString('pt-BR')
                                :
                                'Data não disponível'
                            }
                          </td>
                          <td className=" p-3">
                            {
                              item.DT_TERMINO_PREVISTO ?
                                new Date(item.DT_TERMINO_PREVISTO).toLocaleDateString('pt-BR')
                                :
                                'Data não disponível'
                            }
                          </td>
                          <td className=" p-3">
                            {
                              item.DT_INICIO_REAL ?
                                new Date(item.DT_INICIO_REAL).toLocaleDateString('pt-BR')
                                :
                                'Data não disponível'
                            }
                          </td>
                          <td className=" p-3">
                            {
                              item.DT_TERMINO_REAL ?
                                new Date(item.DT_TERMINO_REAL).toLocaleDateString('pt-BR')
                                :
                                'Data não disponível'
                            }
                          </td>
                          <td className=" p-3">
                            {
                              item.SITUACAO
                            }
                          </td>
                          <td className=" p-3">
                            {
                              item.PERCENT_PLANEJADO
                            }
                          </td>
                          <td className=" p-3">
                            {
                              item.PERCENT_EXEC_ETAPA
                            }
                          </td>
                          <td className=" p-3">
                            {item.DT_INICIO_PREVISTO === null ? (
                              <button
                                onClick={() => {
                                  setEtapaSelecionada(item);
                                  setShowModalInicio(true); // ou o que for para iniciar
                                }}
                                className="px-4 py-2 rounded-md bg-green-500 text-white"
                                title="Iniciar Etapa"
                              >
                                <span className="material-icons">play_arrow</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setEtapaSelecionada(item);
                                  setShowDesempenho(true);
                                }}
                                className="px-4 py-2 rounded-md"
                                title="Aferir Etapa"
                              >
                                <span className="material-icons">sync</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
        </div>
      </div>

    </>
  );
}