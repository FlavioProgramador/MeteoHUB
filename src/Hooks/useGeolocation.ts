export function useGeolocation() {
  interface UseGeolocationProps {
    onSuccess: (lat: number, lon: number) => void;
    onError: (errorMsg: string | null) => void;
  }

  const handleLocation = ({ onSuccess, onError }: UseGeolocationProps) => {
    if (!navigator.geolocation) {
      onError("Geolocalização não é suportada por este navegador.");
      return;
    }
    
    onError(null); 
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSuccess(latitude, longitude);
      },
      () => {
        onError("Não foi possível acessar a localização. O usuário recusou o acesso ou ocorreu um erro.");
      }
    );
  };

  return { handleLocation };
}
