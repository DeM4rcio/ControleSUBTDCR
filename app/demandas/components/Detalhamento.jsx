import React from "react";
import { useDemandaApi } from "../hooks/demandaHook";
import { useState, useEffect } from "react";
import 'material-icons/iconfont/material-icons.css';
import { FaTimes } from 'react-icons/fa';

const DemandDetailsModal = ({ isOpen, onClose, demandaId , item}) => {
  const demandaApi = useDemandaApi();
  const [detailData, setDetailData] = useState([]);
  const [demandData, setDemandData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDetail, setNewDetail] = useState(""); // Estado para o novo detalhamento
  const [isAddingDetail, setIsAddingDetail] = useState(false); // Controle de exibição do campo de detalhamento
 const [sendDetail, setSendDetail] = useState(null)

  useEffect(() => {
    if (isOpen) {
      // Chamada para a API
      const fetchDemandDetails = async () => {
        try {
          const response = await demandaApi.getAllDetalhes(item.DemandaId);
          console.log(response);
          setDetailData(response);  
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false); 
        }
      };

      fetchDemandDetails();
    }
  }, [isOpen, demandaId]); 

  if (!isOpen) return null;

const handleAddDetail = async () => {
  if (newDetail.trim()) {
    const newDetailEntry = { DEMANDA: item.DemandaId, DETALHAMENTO: newDetail };

 
    setSendDetail((prevDetails) => [...(prevDetails || []), newDetailEntry]);

    try {
      await demandaApi.createDetalhe(newDetailEntry); // Envia apenas o novo detalhamento
      setNewDetail(""); // Limpa o campo após a adição
      setIsAddingDetail(false); // Fecha o campo de entrada
      window.location.reload()
    } catch (error) {
      console.error("Erro ao criar detalhamento:", error);
    }
  } else {
    alert("Por favor, insira um detalhamento.");
  }
};



  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded" >
      <div className="bg-white p-6  shadow-lg w-3/4 max-w-4xl ">
      <div className="mt-4 flex justify-between items-center mb-4">
  <div className="">
  <h2 className="text-2xl font-semibold text-center">Detalhes</h2>
  </div>

  <div className=" flex justify-center items-center">
    <div
      onClick={onClose}
      className="cursor-pointer text-white w-10 h-10 rounded-full hover:scale-105 flex items-center justify-center"
    >
      <FaTimes className="text-gray-900 text-lg" />
    </div>
  </div>
</div>



        <div className="grid grid-cols-3 gap-4">
          {/* Histórico de detalhamentos */}
          <div className="col-span-1 border-r pr-4 ">
          <h3 className="font-semibold mb-2">Histórico de detalhamentos</h3>
            <div className="border-l-2 border-gray-300 pl-4">
              {detailData.map((item) => (
                <div key={item.detalheId} className="mb-4">
                  
                  <p className="text-sm">{item.DETALHAMENTO}</p>
                </div>
              ))}
            </div>

          {/* Campo de input para novo detalhamento */}
        {isAddingDetail && (
          <div className="mb-4">
            <textarea
              value={newDetail}
              onChange={(e) => setNewDetail(e.target.value)} // Atualiza o estado com o valor do campo
              className="w-full p-2 border border-gray-300 rounded"
              rows="4"
              placeholder="Digite o novo detalhamento"
            />
            <button
              onClick={handleAddDetail}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Adicionar Detalhamento
            </button>
            <button
              onClick={() => setIsAddingDetail(false)} // Fecha o campo de input
              className="mt-2 ml-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        )}

            <button
            onClick={() => setIsAddingDetail(true)} // Exibe o campo de input
            className="text-white bg-[rgb(1,98,175,255)] rounded p-3 hover:bg-[rgb(1,78,140)] focus:outline-none mb-2"
          > Novo detalhamento
            <span className="material-icons">add</span>
          </button>
          </div>

          {/* Informações da demanda */}
          <div className="col-span-2 bg-gray-100 p-4 rounded">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Nome</p>
                <p>{item.NM_DEMANDA}</p>
              </div>
              <div>
                <p className="font-semibold">Data de Solicitação</p>
                <p>{
                                         (() => {
  try {
    const date = new Date(item.DT_SOLICITACAO);
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC"
    }).format(date);
  } catch {
    return "";
  }
})()

                                    }</p>
              </div>
              <div>
                <p className="font-semibold">Data de Abertura</p>
                <p>{
                                         (() => {
  try {
    const date = new Date(item.DT_ABERTURA);
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC"
    }).format(date);
  } catch {
    return "";
  }
})()

                                    }</p>
              </div>
              <div>
                <p className="font-semibold">Data de Conclusão</p>
                <p>{
                                         (() => {
  try {
    const date = new Date(item.DT_CONCLUSAO);
    return new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC"
    }).format(date);
  } catch {
    return "";
  }
})()

                                    }</p>
              </div>
              <div>
                <p className="font-semibold">Situação</p>
                <p>{item.STATUS}</p>
              </div>
              <div>
                <p className="font-semibold">Unidade</p>
                <p>{item.UNIDADE}</p>
              </div>
              <div>
                <p className="font-semibold">Responsável</p>
                <p>{item.NM_PO_SUBTDCR}</p>
              </div>
              <div>
                <p className="font-semibold">Área Demandante</p>
                <p>{item.NM_AREA_DEMANDANTE.NM_SIGLA}</p>
              </div>
              <div>
                <p className="font-semibold">Demandante</p>
                <p>{item.NM_PO_DEMANDANTE}</p>
              </div>

              <div>
                <p className="font-semibold">Nº Processo SEI</p>
                <p>{item.NR_PROCESSO_SEI}</p>
              </div>
              <div>
                <p className="font-semibold">Periódico</p>
                <p>{item.PERIODICO}</p>
              </div>
              <div>
                <p className="font-semibold">Periodicidade</p>
                <p>{item.PERIODICIDADE}</p>
              </div>
              <div>
                <p className="font-semibold">Patrocinador</p>
                <p>{item.PATROCINADOR}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DemandDetailsModal;
