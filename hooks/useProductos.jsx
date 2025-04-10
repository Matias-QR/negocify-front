import { useQuery } from "@tanstack/react-query";
import useUserStore from "../stores/userStore";

function useProductos() {
  const { selectedAlmacen, userToken } = useUserStore();

  const fetchProductos = async () => {
    const params = new URLSearchParams();

    if (selectedAlmacen?.id) {
      params.append("almacen_id", selectedAlmacen?.id);
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const url = `${import.meta.env.VITE_BACK_URL}api/productos${queryString}`;

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        return { data: [] };
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };

  return useQuery({
    queryKey: ["productos", selectedAlmacen?.id],
    queryFn: fetchProductos,
    enabled: !!userToken && !!selectedAlmacen?.id,
  });
}

export default useProductos;
