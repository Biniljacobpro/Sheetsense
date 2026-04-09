import api from "./api";

export const generatePdf = async (payload) => {
  const response = await api.post("/pdf", payload, {
    responseType: "blob",
  });

  return response.data;
};
