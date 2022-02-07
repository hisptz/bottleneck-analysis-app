import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { useCallback } from "react";

export default function usePrintMap() {
  const printMap = useCallback(async () => {
    const mapElement = document.getElementById("map-container");
    if (mapElement) {
      const mapImage = await domtoimage.toPng(mapElement, {
        filter: (element) => {
          //@ts-ignore
          return !element.classList || !element.classList.contains("leaflet-top") || !element.classList.contains("leaflet-left");
        },
      });
      saveAs(mapImage, "map.png");
    }
  }, []);

  return {
    printMap,
  };
}
