import api from "./api";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getFiles = async () => {
  const response = await api.get("/files");
  return response.data;
};

export const getFileById = async (id) => {
  const response = await api.get(`/files/${id}`);
  return response.data;
};

export const renameFile = async ({ id, filename }) => {
  const response = await api.patch(`/files/${id}`, { filename });
  return response.data;
};

export const deleteFile = async (id) => {
  const response = await api.delete(`/files/${id}`);
  return response.data;
};
