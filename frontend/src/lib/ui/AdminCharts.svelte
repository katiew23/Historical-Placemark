<script lang="ts">

  declare const frappe: any;

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

  function loadCharts(): void {

    new frappe.Chart("#adminChart", {

      title: "Platform Overview",

      type: "bar",

      height: 300,

      data: {
        labels: ["Users", "Collections", "Placemarks"],

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

    new frappe.Chart("#categoryChart", {

      title: "Placemarks by Category",

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

    new frappe.Chart("#roleChart", {

      title: "Users by Role",

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

    new frappe.Chart("#countyChart", {

      title: "Placemarks by County",

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
  }

  $effect(() => {

  if (
    categoryLabels.length > 0 &&
    roleLabels.length > 0 &&
    countyLabels.length > 0
  ) {

    setTimeout(() => {
      loadCharts();
    }, 100);
  }
});
</script>

<div class="box">
  <div id="adminChart"></div>
</div>

<div class="box">
  <div id="categoryChart"></div>
</div>

<div class="box">
  <div id="roleChart"></div>
</div>

<div class="box">
  <div id="countyChart"></div>
</div>