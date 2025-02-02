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

  
  
export const getDiscovererId = async (
    id: number | string
  ): Promise<Discoverer> => {
    return fetch(`/discoverers/${id}/`).then(
      (response) => response.json()
    );
  };
 