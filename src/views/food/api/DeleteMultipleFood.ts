import { httpClient } from "../../../api/HttpClient";

const DeleteMultipleFood = async (ids: number[]) => {
  return httpClient
    .delete(`${import.meta.env.VITE_APP_BASE_API}/foods`, {
      data: {
        ids: ids.join(","),
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((response: any) => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch((error: any) => {
      throw error;
    });
};

export default DeleteMultipleFood;
