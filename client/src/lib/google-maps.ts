declare global {
  interface Window {
    google: any;
  }
}

export const initializeGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (error) => reject(error);
    document.head.appendChild(script);
  });
};

export const createMap = (element: HTMLElement, options: any) => {
  return new window.google.maps.Map(element, options);
};

export const createMarker = (options: any) => {
  return new window.google.maps.Marker(options);
};

export const createInfoWindow = (options: any) => {
  return new window.google.maps.InfoWindow(options);
};
