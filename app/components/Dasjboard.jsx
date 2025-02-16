import { useState, useEffect, useRef } from "react";
import 'material-icons/iconfont/material-icons.css';
import Chart from "chart.js/auto";
import { getAllItems } from "../services/apiService";

const Dashboard = () => {
  const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const barChartRef = useRef(null);
    const doughnutChartRef = useRef(null);
    const demandanteChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const [andamneto, setAndamento] = useState(0);
    const [atrasado, setAtrasado] = useState(0);
    const [concluido, setConcluido] = useState(0);
    const [nao, setNao] = useState(0);
    
    const destroyChart = (chartRef) => {
    if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
    }
    };

    const fetchItems = async () => {
    setIsLoading(true);
    try {
        const data = await getAllItems();
        console.log("Dados recebidos:", data);

        if (!Array.isArray(data)) {
        console.warn("O retorno da API não é um array:", data);
        setItems([]);
        return;
        }

        setItems(data);
    } catch (error) {
        console.error("Erro ao buscar itens", error);
    } finally {
        setIsLoading(false);
    }
    };

useEffect(() => {
  fetchItems();
}, []);

useEffect(() => {
  if (items.length > 0) {
    updateCharts(items);
  }
}, [items]);
const updateCharts = (data) => {
  const categorias = {};
  const status = { Em_andamento: 0, Atrasados: 0, Realizadas: 0, Nao_iniciada: 0 };
  const demandante = {};

  data.forEach((item) => {
    // Contabilizar categorias
    if (!categorias[item.CATEGORIA]) {
      categorias[item.CATEGORIA] = { soma: 0, count: 0 };
    }
    categorias[item.CATEGORIA].soma += 1;
    categorias[item.CATEGORIA].count += 1;

    // Contabilizar status
    if (item.STATUS === "Em andamento") status["Em_andamento"] += 1;
    if (item.STATUS === "Não iniciada") status["Nao_iniciada"] += 1;
    if (item.STATUS === "Atrasados") status["Atrasados"] += 1;
    if (item.STATUS === "Realizadas") status["Realizadas"] += 1;
    
    // Contabilizar demandantes

    setAndamento(status["Em_andamento"])
    setAtrasado(status["Atrasados"])
    setConcluido(status["Realizadas"])
    setNao(status["Nao_iniciada"])

    const nome = item.NM_PO_DEMANDANTE;
    if (!demandante[nome]) {
      demandante[nome] = 1;
    } else {
      demandante[nome] += 1;
    }
  });

  const labels = Object.keys(categorias);
  const valoresMedios = labels.map((cat) => categorias[cat].soma / categorias[cat].count);

  // Gráfico de categorias
  destroyChart(barChartRef);
  barChartRef.current.chartInstance = new Chart(barChartRef.current, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Média por Categoria",
          data: valoresMedios,
          backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
        },
      ],
    },
  });

  // Gráfico de status
  destroyChart(doughnutChartRef);
  doughnutChartRef.current.chartInstance = new Chart(doughnutChartRef.current, {
    type: "doughnut",
    data: {
      labels: ["Realizadas", "Em andamento", "Atrasadas", "Não iniciada"],
      datasets: [
        {
          data: [status["Realizadas"], status["Em_andamento"], status["Atrasados"], status["Nao_iniciada"]],
          backgroundColor: ["#17eba0", "#ffbc44", "#fc6161", "#1c2c34"],
        },
      ],
    },
  });

  // Gráfico de demandantes
  const demandanteLabels = Object.keys(demandante);
  const demandanteValues = Object.values(demandante);

  destroyChart(demandanteChartRef);
  demandanteChartRef.current.chartInstance = new Chart(demandanteChartRef.current, {
    type: "bar",
    data: {
      labels: demandanteLabels,
      datasets: [
        {
          label: "Quantidade de CA PO por Demandante",
          data: demandanteValues,
          backgroundColor: "#1c2c34",
        },
      ],
    },
  });

  // Gráfico de linha (fixo conforme o exemplo)
  destroyChart(lineChartRef);
  lineChartRef.current.chartInstance = new Chart(lineChartRef.current, {
    type: "line",
    data: {
      labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
      datasets: [
        {
          data: [10, 15, 8, 12],
          borderColor: "#fc6161",
          fill: true,
        },
      ],
    },
  });
};

return (

    <div className="bg-white">

    <nav className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                   
                    <button type="button" 
                        className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="sr-only">Abrir menu principal</span>
                      
                        <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
               
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start ">
                    <div className="flex flex-shrink-0 items-center">
                        <img className="h-14 w-auto"
                            src="images.png"
                            alt="SUBTDCR"/>
                    </div>
                    
                    <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4">
                            <a href="#" className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium">Dashboard</a>
                            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">Equipe</a>
                        </div>
                    </div>
                   
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                    <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4">
                            <a href="#"
                                className="text-gray-300 hover:bg-gray-700 hover:text-white block border-2 rounded-md px-3 py-2 text-base font-medium">Área
                                logada</a>
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
       
        <div className="hidden sm:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pb-3 pt-2">
                <a href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Área
                    logada</a>
            </div>
        </div>
    </nav>
    
    <div className="mx-auto bg-white ">
        <div className=" max-w-6xl mx-auto bg-white mt p-4">
            <div className="mb-6">
                <h2 className="text-4xl font-semibold text-black ">Bem-vindo ao sistema de gestão da SUBTDCR</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 text-black">
                
                <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2"
                   style={{ borderColor: '#17eba0', height: 'auto' }}>

                    <div className="text-left">
                        <h3 className="text-3xl font-bold">{concluido}</h3>
                        <p className="text-gray-600">demandas Realizadas</p>
                    </div>
                    <span className="material-icons text-5xl" style={{color: '#17eba0'}}>check_circle</span>
                </div>
               
                <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2"
                    style={{borderColor: "#ffbc44" ,height: "auto"}}>
                    <div className="text-left">
                        <h3 className="text-3xl font-bold">{andamneto}</h3>
                        <p className="text-gray-600">demandas em andamento</p>
                    </div>
                    <span className="material-icons text-5xl" style={{color: "#ffbc44"}}>pending</span>
                </div>
               
                <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2"
                    style={{borderColor: "#fc6161", height: "auto"}}>
                    <div className="text-left">
                        <h3 className="text-3xl font-bold">{atrasado}</h3>
                        <p className="text-gray-600">demandas atrasadas</p>
                    </div>
                    <span className="material-icons text-5xl" style={{color: "#fc6161"}}>warning</span>
                </div>
             
                <div className="bg-white shadow-lg rounded-2xl p-3 flex justify-between items-center border-2"
                    style={{borderColor: "#1c2c34", height: "auto"}}>
                    <div className="text-left">
                        <h3 className="text-3xl font-bold">{nao}</h3>
                        <p className="text-gray-600">Não iniciadas</p>
                    </div>
                    <span className="material-icons text-5xl" style={{color: "#1c2c34"}}>schedule</span>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 mb-4">

                <div className="flex-1 relative">
                    <select defaultValue={"todos"} className="w-full border rounded-full p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none">
                        <option  disabled >Selecione o período</option>
                        <option value={"todos"}>Todos</option>
                        <option>Última semana</option>
                        <option>Último mês</option>
                        <option>Últimos 6 meses</option>
                        <option>Último ano</option>
                    </select>
                    
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <select defaultValue={"todas"} className="w-full border rounded-full p-2 pl-4 pr-10 bg-white text-gray-900 appearance-none">
                        <option  disabled >Selecione uma categoria</option>
                        <option value={"todas"}>Todas</option>
                        <option>Categoria</option>

                    </select>
                   
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

        </div>
       
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-black text-center " >
  <div className="bg-white shadow-lg rounded-2xl p-4">
    <h3 className="text-xl font-semibold mb-2 text-black">Quantidade de demanda por categoria</h3>
    <div className="w-full h-[300px]">
      <canvas ref={barChartRef} />
    </div>
  </div>

  <div className="bg-white shadow-lg rounded-2xl p-4">
    <h3 className="text-xl font-semibold mb-2 ">Status de demandas</h3>
    <div className="w-full h-[300px]">
      <canvas ref={doughnutChartRef} />
    </div>
  </div>

  <div className="bg-white shadow-lg rounded-2xl p-4">
    <h3 className="text-xl font-semibold mb-2 text-black ">Quantidades de demandas por demandante</h3>
    <div className="w-full h-[300px]">
     <canvas ref={demandanteChartRef} />
    </div>
  </div>

  <div className="bg-white shadow-lg rounded-2xl p-4">
    <h3 className="text-xl font-semibold mb-2 ">Tempo médio por demanda</h3>
    <div className="w-full h-[300px]">
      <canvas ref={lineChartRef} />
    </div>
  </div>
</div>
    
    <div className="mx-auto bg-white mt-5">
        <div className="p-4 max-w-6xl mx-auto bg-white mt-5 mb-5">
         
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">

                <div className="flex-1 relative">
                    <select defaultValue={"todas"} className="w-full border rounded-full p-2 pl-4 pr-10 bg-gray-900 text-white appearance-none">
                        <option  disabled >Selecione uma categoria</option>
                        <option value={"todas"}>Todas</option>
                        <option>Categoria</option>
                    </select>
                   
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <select defaultValue={"todas"} className="w-full border rounded-full p-2 pl-4 pr-10 bg-gray-900 text-white appearance-none">
                        <option disabled>Selecione a unidade</option>
                        <option value={"todas"} >Todas</option>
                        <option>CGOV</option>
                        <option>UCR</option>
                        <option>UPTD</option>
                    </select>
                   
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <select defaultValue={""} className="w-full border rounded-full p-2 pl-4 pr-10 bg-gray-900 text-white appearance-none">
                        <option value="" disabled selected>Selecione o status</option>
                        <option>Atrasado</option>
                        <option>Em andamento</option>
                        <option>Concluído</option>
                    </select>
                  
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <input type="text" placeholder="Buscar"
                        className="w-full border rounded-full p-2 pl-4 pr-10 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                   
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1111.32 3.906l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387A6 6 0 012 8z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>

            </div>



           
            <div className="flex gap-4 text-black">
              
                <div className="flex-1 overflow-x-auto mt-2">
                    <table className="w-full border-collapse border">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="border p-2 text-left">Nome Demanda</th>
                                <th className="border p-2 text-left">Data de Abertura</th>
                                <th className="border p-2 text-left">Status</th>
                                <th className="border p-2 text-left">Categoria</th>
                                <th className="border p-2 text-left">Demandante</th>
                                <th className="border p-2 text-left">Data da Conclusão</th>
                                <th className="border p-2 text-left">Responsável</th>
                                <th className="border p-2 text-left">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.ID} className="shadow">   
                                <td className="border p-2">{item.NM_DEMANDA}</td>
                        
                              <td className="border p-2">
                                {(() => {
                                    try {
                                    const data = new Date(item.DT_ABERTURA);
                                    if (isNaN(data)) throw new Error("Data inválida");
                                    return data.toLocaleDateString("pt-BR");
                                    } catch {
                                    return "";
                                    }
                                })()}
                                </td>
                                <td className="border p-2">{item.STATUS}</td>
                                <td className="border p-2">{item.CATEGORIA}</td>
                                <td className="border p-2">{item.NM_PO_DEMANDANTE}</td>
                                <td className="border p-2">{item.DT_CONCLUSAO}</td>
                                <td className="border p-2">{item.PO_SUBTDCR}</td>
                                <td className="border p-2">{item.NM_PO_SUBTDCR}</td>

                                </tr>
                            ))}
                           
                
                        </tbody>
                    </table>
                 
                    <div className="pagination mx-auto mt-5" style={{textAlign: "center"}}>
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

    
    

  </div>

 </div>
);

};

export default Dashboard;
