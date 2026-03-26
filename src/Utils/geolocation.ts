export interface GeolocationCallbacks {
  onSuccess: (lat: number, lon: number) => void;
  onError: (errorMsg: string | null) => void;
}

export function handleGeolocation({ onSuccess, onError }: GeolocationCallbacks) {
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
}
