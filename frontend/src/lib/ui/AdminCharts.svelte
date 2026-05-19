<script lang="ts">
  
  import { onMount } from "svelte";
  import { Chart } from "frappe-charts";
  
  let {
    userCount,
    collectionCount,
    placemarkCount,
    
    categoryLabels,
    categoryCounts,
    
    roleLabels,
    roleCounts,
    
    countyLabels,
    countyCounts
    
  } = $props<{
    userCount: number;
    collectionCount: number;
    placemarkCount: number;
    
    categoryLabels: string[];
    categoryCounts: number[];
    
    roleLabels: string[];
    roleCounts: number[];
    
    countyLabels: string[];
    countyCounts: number[];
  }>();
  
  function clearCharts() {
    
    document
    .querySelectorAll(".chart-container")
    .forEach((c) => {
      c.innerHTML = "";
    });
  }
  
  onMount(() => {
    
    clearCharts();
    
    new Chart("#adminChart", {
      
      title:
      "Platform Overview • Forbhreathnú Ardáin",
      
      type: "bar",
      
      height: 300,
      
      data: {
        
        labels: [
        "Users",
        "Collections",
        "Placemarks"
        ],
        
        datasets: [
        {
          values: [
          userCount,
          collectionCount,
          placemarkCount
          ]
        }
        ]
      }
    });
    
    new Chart("#categoryChart", {
      
      title:
      "Placemarks by Category • Catagóirí",
      
      type: "pie",
      
      height: 300,
      
      data: {
        
        labels: categoryLabels,
        
        datasets: [
        {
          values: categoryCounts
        }
        ]
      }
    });
    
    new Chart("#roleChart", {
      
      title:
      "Users by Role • Róil",
      
      type: "donut",
      
      height: 300,
      
      data: {
        
        labels: roleLabels,
        
        datasets: [
        {
          values: roleCounts
        }
        ]
      }
    });
    
    new Chart("#countyChart", {
      
      title:
      "Placemarks by County • Contaetha",
      
      type: "line",
      
      height: 300,
      
      data: {
        
        labels: countyLabels,
        
        datasets: [
        {
          values: countyCounts
        }
        ]
      }
    });
    
  });
  
</script>

<div class="box">
  <div
  id="adminChart"
  class="chart-container"
  ></div>
</div>

<div class="box">
  <div
  id="categoryChart"
  class="chart-container"
  ></div>
</div>

<div class="box">
  <div
  id="roleChart"
  class="chart-container"
  ></div>
</div>

<div class="box">
  <div
  id="countyChart"
  class="chart-container"
  ></div>
</div>