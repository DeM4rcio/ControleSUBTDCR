const API_URL = process.env.NEXT_PUBLIC_API_URL_ETAPA || "http://localhost:5148/api/etapa";

export const getAllEtapas = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    console.log(`${response} easdasdas`)
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getItemById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/byid/${id}`);
    if (!response.ok) throw new Error(`Erro ao obter item ${id}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createEtapa = async (itemData, id) => {
  try {
    console.log("Enviando dados:", JSON.stringify(itemData)); // Log para debug

    const response = await fetch(`${API_URL}/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData), // Envia o objeto diretamente, sem "fields"
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao criar item: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error.message);
    return null;
  }
};


export const updateItem = async (id, itemData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteItem = async (id) => {
  try {
    const response = await fetch(`${API_URL}/items/${id}`, { method: "DELETE" });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

