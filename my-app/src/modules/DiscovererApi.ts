export interface Discoverer {
    id: number;
    name: string;
    years_of_life: string;
    image_url: string;
    long_description: string;
  }
export const getDiscoverer = async (name = ""): Promise<Discoverer[]> => {
  return fetch(`/discoverers/?discovererName=${name}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибка сети');
      }
      return response.json();
    });
};

  
  
export const getDiscovererId = async (
    id: number | string
  ): Promise<Discoverer> => {
    return fetch(`/discoverers/${id}/`).then(
      (response) => response.json()
    );
  };
 