"use client"
import React, { useEffect, useState } from "react";
import { deleteItem, getAllItems } from "./services/projetoService";
import Header from "../demandas/components/Header";
import ProjetoForm from "./components/ProjetoForm";
import 'material-icons/iconfont/material-icons.css';
import { FaTrash, FaEdit , FaPlus, FaEye} from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from "chart.js";
import { getAllEtapas } from "./services/etapaSevice";

// Registrando os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function Projetos () {

  const [data, setData] = useState([]);
  const [modalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const [chartData, setChartData] = useState({ concluido: 0, andamento: 0, atrasado: 0 });
  const [ total_SUBTDCR, setTotal_SUBTDCR ] = useState(0);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
      const handleItens = async () => {
          const response = await getAllItems();
          setData(response);
          setTotal_SUBTDCR(response.length)
      };
      handleItens();
  }, []);


  useEffect(() => {
      const authStatus = localStorage.getItem("authenticated") === "true";
      setIsAuthenticated(authStatus);
  }, []);

  // Dados fictícios para os gráficos
 useEffect(() => {
        const fetchProjetos = async () => {
            let concluido = 0, andamento = 0, atrasado = 0;

            for (const projeto of data) {

             
                let hasAtraso = false;
                let hasAndamento = false;
                let hasConcluido = false

               

                if (hasAtraso) atrasado++;
                else if (hasAndamento) andamento++;
                else if(hasConcluido) concluido++;
            }

            setChartData({ concluido, andamento, atrasado })
        };
        fetchProjetos();
    }, [data]);

    const barData = {
        labels: ["Concluído", "Em Andamento", "Atrasado"],
        datasets: [
            {
                label: "Projetos",
                data: [chartData.concluido, chartData.andamento, chartData.atrasado],
                backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
            }
        ]
    };


  const lineData = {
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai"],
      datasets: [
          {
              label: "Projetos Criados",
              data: [1, 3, 2, 5, 4],
              borderColor: "#FF9800",
              borderWidth: 2,
              fill: false,
          }
      ]
  };

  return (
<>
  <div className="bg-white">
    <Header />
    <div className="max-w-6xl mx-auto bg-white mt p-4 ">
      <div className="mb-6">
        <h2 className="text-4xl font-semibold text-black">
          Bem-vindo ao sistema de gestão de projetos da SETIC
        </h2>
      </div>

      {/* Cards centralizados */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 text-black pb-10">
        <div
          className="bg-white shadow-lg rounded-2xl p-3 flex border-2 w-60"
          style={{ borderColor: "black", height: "auto" }}
        >
          <div className="text-left">
            <h3 className="text-3xl font-bold">{total_SUBTDCR}</h3>
            <p className="text-gray-600">Projetos SUBTDCR</p>
          </div>
        </div>

        <div
          className="bg-white shadow-lg rounded-2xl p-3 flex border-2 w-60"
          style={{ borderColor: "black", height: "auto" }}
        >
          <div className="text-left">
            <h3 className="text-3xl font-bold">0</h3>
            <p className="text-gray-600">Projetos SUBSIS</p>
          </div>
        </div>

        <div
          className="bg-white shadow-lg rounded-2xl p-3 flex border-2 w-60"
          style={{ borderColor: "black", height: "auto" }}
        >
          <div className="text-left">
            <h3 className="text-3xl font-bold">0</h3>
            <p className="text-gray-600">Projetos SUBINFRA</p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto bg-white text-black">
    <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4 p-4">
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-2xl p-3 h-64 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-center pb-3">Situação da demanda</h3>
            <div className="max-h-40">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>

        </div>
    </div>
</div>

      <ProjetoForm onClose={handleCloseModal} isOpen={modalOpen} />
      <div className=" mb-6  justify-items-end">


{isAuthenticated && (
  <div
    onClick={handleOpenModal}
    className="cursor-pointer bg-[rgb(1,98,175,255)] hover:bg-[rgb(1,78,140)] text-white w-10 h-10 rounded-full hover:scale-105 flex items-center justify-center"
  >
    <FaPlus className="text-white text-lg" />
  </div>
)}


</div>

      <div className="flex gap-4 text-black bg-white">
        <div className="flex-1 overflow-x-auto mt-2">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">Nome do projeto</th>
                <th className="border p-2 text-left">Gerente do Projeto</th>
                <th className="border p-2 text-left">Unidade</th>
                <th className="border p-2 text-left">Área Demandante</th>
                <th className="border p-2 text-left">Ano</th>
                {isAuthenticated && <th className="border p-2 text-left">Ação</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.projetoId} className="shadow">
                  <td className="border p-2">{item.NM_PROJETO}</td>
                  <td className="border p-2">{item.GERENTE_PROJETO}</td>
                  <td className="border p-2">{item.UNIDADE}</td>
                  <td className="border p-2">{item.NM_AREA_DEMANDANTE}</td>
                  <td className="border p-2">{item.ANO}</td>
                  {isAuthenticated && (
                    <td className="border p-2 flex gap-2 justify-center">
                      <button
                        id="etapa"
                        className="button is-primary"
                        onClick={() => router.push(`/projeto/etapa/${item.projetoId}`)}
                      >
                        <span className="material-icons">sync</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination mx-auto mt-5 text-center">
            <button id="prev" className="button is-primary">
              <span className="material-icons">chevron_left</span>
            </button>
            <button id="next" className="button is-primary">
              <span className="material-icons">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</>

  );
}
