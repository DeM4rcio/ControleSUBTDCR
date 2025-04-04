"use client";

import React, { useEffect, useState } from "react";
import { createItem, fetchTemplates } from "../services/projetoService";

const ProjetoForm = ({ onClose, isOpen }) => {
  if (!isOpen) return null;

  const [projeto, setProjeto] = useState({
    NM_PROJETO: "",
    GERENTE_PROJETO: "",
    SITUACAO: "",
    UNIDADE: "",
    NR_PROCESSO_SEI: "",
    NM_AREA_DEMANDANTE: "",
    ANO: "2025",
    TEMPLATE: "",
    profiscoii: false,
    pdtiC2427: false,
    ptD2427: false

  });

  const [error, setError] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createItem(projeto);

      
        

        setProjeto({
          NM_PROJETO: "",
          GERENTE_PROJETO: "",
          SITUACAO: "",
          UNIDADE: "",
          NR_PROCESSO_SEI: "",
          NM_AREA_DEMANDANTE: "",
          ANO: "2025",
          TEMPLATE: "",
          profiscoii: false,
          pdtiC2427: false,
          ptD2427: false
        });

        console.log("Cadastro realizado com sucesso!");
        onClose();
        window.location.reload();
      
    } catch (error) {
      setError("Erro no momento do cadastro do Projeto");
      console.error("Erro ao enviar o formulário:", error);
    }
  };

 const handleChange = (e) => {
  const { name, type, value, checked } = e.target;

  setProjeto((prev) => ({
    ...prev,
    
    [name]: type === "checkbox" ? checked : value,
  }));
};


  return (
    <>
<div className="fixed inset-0 flex items-center justify-center bg-black text-black bg-opacity-50">
  <div className="bg-white p-6 rounded-lg shadow-md w-[1250px] relative h-[500px] flex flex-col">
    <h2 className="text-2xl font-semibold mb-4 text-center">Cadastro de Projeto</h2>
    {error && <div className="text-red-500 mb-4">{error}</div>}

    <form onSubmit={handleSubmit} className="flex flex-col flex-grow space-y-4">
      <div className="grid grid-cols-3 gap-4 w-full">
        <div>
          <label className="block text-sm font-medium">Nome do Projeto</label>
          <input
            type="text"
            name="NM_PROJETO"
            className="w-full p-2 border border-gray-300 rounded mt-1 h-12"
            value={projeto.NM_PROJETO}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Gerente do Projeto</label>
          <input
            type="text"
            name="GERENTE_PROJETO"
            className="w-full p-2 border border-gray-300 rounded mt-1 h-12"
            value={projeto.GERENTE_PROJETO}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Unidade</label>
          <input
            type="text"
            name="UNIDADE"
            className="w-full p-2 border border-gray-300 rounded mt-1 h-12"
            value={projeto.UNIDADE}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Número do Processo SEI</label>
          <input
            type="text"
            name="NR_PROCESSO_SEI"
            className="w-full p-2 border border-gray-300 rounded mt-1 h-12"
            value={projeto.NR_PROCESSO_SEI}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Área Demandante</label>
          <input
            type="text"
            name="NM_AREA_DEMANDANTE"
            className="w-full p-2 border border-gray-300 rounded mt-1 h-12"
            value={projeto.NM_AREA_DEMANDANTE}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Template</label>
          <select
            name="TEMPLATE"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
            value={projeto.TEMPLATE}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um template</option>
          
            <option value="Contratação pregão">Contratação pregão</option>
          
          </select>
        </div>
<div>
              <label className="block text-sm font-medium">Tags</label>
              <div className="flex flex-col space-y-1 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="pdtiC2427"
                    checked={projeto.pdtiC2427}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  PDTIC 24/27
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="profiscoii"
                    checked={projeto.profiscoii}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  PROFISCO II
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="ptD2427"
                    checked={projeto.ptD2427}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  PTD 24/27
                </label>
              </div>

             
            </div>
          </div>

      {/* Botões fixos dentro do modal */}
      <div className="w-full flex justify-end space-x-2 mt-auto">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Cadastrar
        </button>
      </div>
    </form>
  </div>
</div>

    </>
  );
};

export default ProjetoForm;
