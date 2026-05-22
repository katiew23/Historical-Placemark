<script lang="ts">
  import { onMount, tick } from "svelte";

  interface Placemark {
    _id?: string;
    name?: string;
    description?: string;
    latitude: number;
    longitude: number;
    category?: string;
    county?: string;
    yearEstablished?: number;
  }

  let {
    placemarks,
    mapId,
    enableClickToSetCoordinates = false,
    setCoordinates = null
  } = $props<{
    placemarks: Placemark[];
    mapId: string;
    enableClickToSetCoordinates?: boolean;
    setCoordinates?: ((latitude: number, longitude: number) => void) | null;
  }>();

  let L: any;

  let map: any;

  const apiKey = "af52a9802a4c633460b714fc47b6fb91";

  onMount(async () => {
    console.log("PLACEMARK MAP LOADING:", mapId);

    const leaflet = await import("leaflet");

    L = leaflet.default;

    await tick();

    initMap();
  });

  function initMap() {
    if (map) {
      map.remove();
    }

    map = L.map(mapId).setView(
      [52.26, -7.11],
      10
    );

    const baseLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          "&copy; OpenStreetMap contributors"
      }
    ).addTo(map);

    const tempLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      {
        attribution:
          "OpenWeatherMap"
      }
    );

    const cloudsLayer = L.tileLayer(
      `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      {
        attribution:
          "OpenWeatherMap"
      }
    );

    L.control.layers(
      {
        OpenStreetMap: baseLayer
      },
      {
        Temperature: tempLayer,
        Clouds: cloudsLayer
      }
    ).addTo(map);

    const customIcon = L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",

      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

      iconSize:
        [25, 41],

      iconAnchor:
        [12, 41],

      popupAnchor:
        [1, -34],

      shadowSize:
        [41, 41]
    });

    const markers: any[] = [];

    placemarks.forEach((placemark) => {
      if (
        !isNaN(placemark.latitude) &&
        !isNaN(placemark.longitude)
      ) {
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${placemark.latitude}&lon=${placemark.longitude}&appid=${apiKey}&units=metric`
        )
          .then((res) => res.json())
          .then((weather) => {
            const marker = L.marker(
              [
                placemark.latitude,
                placemark.longitude
              ],
              {
                icon: customIcon
              }
            )
              .addTo(map)
              .bindPopup(`
                <div style="min-width:220px">

                  <h3 style="
                    margin-bottom:8px;
                    font-size:18px;
                    font-weight:600;
                  ">
                    ${placemark.name || ""}
                  </h3>

                  <p style="
                    margin-bottom:12px;
                    color:#666;
                  ">
                    ${placemark.description || ""}
                  </p>

                  <p>
                    <strong>Category:</strong>
                    ${placemark.category || ""}
                  </p>

                  <p>
                    <strong>County:</strong>
                    ${placemark.county || ""}
                  </p>

                  <p>
                    <strong>Year:</strong>
                    ${placemark.yearEstablished || ""}
                  </p>

                  <p>
                    🌡️ ${weather.main?.temp ?? "N/A"}°C •
                    ${weather.weather?.[0]?.main || "Weather unavailable"}
                  </p>

                </div>
              `);

            markers.push(marker);

            if (markers.length > 0) {
              const group = L.featureGroup(markers);

              map.fitBounds(
                group
                  .getBounds()
                  .pad(0.2)
              );
            }
          })
          .catch((error) => {
            console.log("MAP WEATHER ERROR:", error);
          });
      }
    });

    if (enableClickToSetCoordinates && setCoordinates) {
      map.on(
        "click",
        (e: any) => {
          const latitude = Number(
            e.latlng.lat.toFixed(6)
          );

          const longitude = Number(
            e.latlng.lng.toFixed(6)
          );

          setCoordinates(latitude, longitude);

          if ((window as any).__tempMarker) {
            map.removeLayer(
              (window as any).__tempMarker
            );
          }

          (window as any).__tempMarker = L.marker(
            e.latlng,
            {
              icon: customIcon
            }
          ).addTo(map);
        }
      );
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    console.log("PLACEMARK MAP LOADED:", mapId);
  }
</script>

<div
  id={mapId}
  style="height: 500px;"
></div>