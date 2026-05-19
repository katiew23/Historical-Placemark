<script lang="ts">
    import { onMount } from "svelte";
    import { Chart } from "frappe-charts";
    
    let {
        latitude,
        longitude
    } = $props<{
        latitude: number;
        longitude: number;
    }>();
    
    const apiKey = "af52a9802a4c633460b714fc47b6fb91";
    
    onMount(async () => {
        try {
            console.log("WEATHER FORECAST CHART LOADING:", latitude, longitude);
            
            const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
            );
            
            const forecast = await response.json();
            
            const labels = forecast.list
            .slice(0, 8)
            .map((item: any) => {
                const date = new Date(item.dt_txt);
                
                return date.toLocaleString("en-IE", {
                    weekday: "short",
                    hour: "2-digit",
                    hour12: false
                });
            });
            const temperatures = forecast.list
            .slice(0, 8)
            .map((item: any) => item.main.temp);
            
            new Chart("#weatherForecastChart", {
                title: "Weather Forecast Trend • Réamhaisnéis Aimsire",
                type: "line",
                height: 300,
                data: {
                    labels,
                    datasets: [
                    {
                        values: temperatures
                    }
                    ]
                }
            });
            
            console.log("WEATHER FORECAST CHART LOADED");
        } catch (error) {
            console.log("WEATHER FORECAST CHART ERROR:", error);
        }
    });
</script>

<div class="box mt-5">
    <div
    id="weatherForecastChart"
    class="chart-container"
    ></div>
</div>