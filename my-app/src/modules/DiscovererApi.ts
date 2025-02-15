export interface Discoverer {
    id: number;
    name: string;
    years_of_life: string;
    image_url: string;
    long_description: string;
  }
  
  export const getDiscoverer = async (name = ""): Promise<Discoverer[]> => {
    const response = await fetch(`/discoverers/?discovererName=${name}`);
    if (!response.ok) {
      throw new Error('Ошибка сети');
    }
    const data = await response.json();
    return data.discoverers; // Возвращаем только массив discoverers
  };

  
  
  export const getDiscovererId = async (id: string): Promise<Discoverer> => {
    try {
      const token = localStorage.getItem("token"); // Получаем токен
  
      if (!token) {
        throw new Error("Токен отсутствует, требуется авторизация");
      }
  
      const response = await fetch(`/api/discoverers/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Передаем токен
        },
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Ошибка при загрузке первооткрывателя:", error);
      throw error;
    }
  };
  
 