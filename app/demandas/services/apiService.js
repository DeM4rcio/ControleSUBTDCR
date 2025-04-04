const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5148/api/demanda";

export const getAllItems = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) throw new Error("Erro ao obter itens");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getItemById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error(`Erro ao obter item ${id}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createItem = async (itemData) => {
  try {
    console.log("Enviando dados:", JSON.stringify(itemData)); // Log para debug

    const response = await fetch(`${API_URL}/`, {
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

    return await response.text();
  } catch (error) {
    console.error("Erro na requisição:", error.message);
    return null;
  }
};


export const updateItem = async (id, itemData) => {
  try {
    console.log(id)
    console.log(itemData)
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
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const tmpAVG = async () => {
  try {
    const response = await fetch(`${API_URL}/rank`, { method: "GET" });
    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
};