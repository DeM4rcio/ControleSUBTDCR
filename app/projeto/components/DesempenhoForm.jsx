import { useEffect, useState } from "react";
import { getItemById, updateItem } from "../services/etapaSevice"; // Importando a função correta

export const DesempenhoForm = ({ onClose, isOpen, etapa }) => {
  const [formData, setFormData] = useState({
    DT_INICIO_REAL: "",
    DT_TERMINO_REAL: "",
    PERCENT_EXEC_ETAPA: "",
    ANALISE: "",
  });


 
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ""; 

  return dateString.split("T")[0]; 
  };

  const handleLoadItem = async () => {
    if (!etapa?.EtapaProjetoId) return; 

    const data = await getItemById(etapa.EtapaProjetoId);
    console.log(data)
    if (data) {
      setFormData({
        DT_INICIO_REAL: formatDateForDisplay(data.DT_INICIO_REAL),
        DT_TERMINO_REAL: formatDateForDisplay(data.DT_TERMINO_REAL),
        PERCENT_EXEC_ETAPA: data.PERCENT_EXEC_ETAPA || "",
        ANALISE: data.ANALISE || "",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadItem();
    }
  }, [isOpen, etapa]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemData = {
      DT_INICIO_REAL: formData.DT_INICIO_REAL,
      DT_TERMINO_REAL: formData.DT_TERMINO_REAL,
      PERCENT_EXEC_ETAPA: formData.PERCENT_EXEC_ETAPA,
      ANALISE: formData.ANALISE,
    };

    await updateItem(etapa.EtapaProjetoId, itemData);
    alert("Etapa analisada com sucesso!");
    onClose();
    window.location.reload();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-md w-[1200px] shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Nova análise de Empenho</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium">Data Início Real</label>
              <input
                type="date"
                name="DT_INICIO_REAL"
                value={formData.DT_INICIO_REAL}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Data Término Real</label>
              <input
                type="date"
                name="DT_TERMINO_REAL"
                value={formData.DT_TERMINO_REAL}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Percentual Executado da Etapa</label>
              <input
                type="number"
                name="PERCENT_EXEC_ETAPA"
                value={formData.PERCENT_EXEC_ETAPA}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4 col-span-3">
              <label className="block text-sm font-medium">Análise da Etapa</label>
              <textarea
                name="ANALISE"
                value={formData.ANALISE}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md resize-y"
                placeholder="Digite a análise aqui..."
              />
            </div>

            <div className="col-span-3 flex justify-end space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Nova análise
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default DesempenhoForm;
