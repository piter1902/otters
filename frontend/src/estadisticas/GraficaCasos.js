import { Chart, registerables } from "chart.js";
import React, { JSXElementConstructor, useEffect, useRef } from "react";

const GraficaCasos = () => {
  // Datos mock de prueba
  const data = [
    { date: "2007-04-23", value: 93.24 },
    { date: "2007-04-24", value: 95.35 },
    { date: "2007-04-25", value: 98.84 },
    { date: "2007-04-26", value: 99.92 },
    { date: "2007-04-29", value: 99.8 },
    { date: "2007-05-01", value: 99.47 },
    { date: "2007-05-02", value: 100.39 },
    { date: "2007-05-03", value: 100.4 },
    { date: "2007-05-04", value: 100.81 },
    { date: "2007-05-07", value: 103.92 },
    { date: "2007-05-08", value: 105.06 },
    { date: "2007-05-09", value: 106.88 },
    { date: "2007-05-09", value: 107.34 },
    { date: "2007-05-10", value: 108.74 },
    { date: "2007-05-13", value: 109.36 },
    { date: "2007-05-14", value: 107.52 },
    { date: "2007-05-15", value: 107.34 },
    { date: "2007-05-16", value: 109.44 },
    { date: "2007-05-17", value: 110.02 },
    { date: "2007-05-20", value: 111.98 },
  ];

  // Referencia al canvas
  const canvas = useRef(null);

  // Creación del gráfico
  useEffect(() => {
    const ctx = canvas.current.getContext('2d');
    Chart.register(...registerables);
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.date),
        datasets: [
          {
            label: "# casos",
            data: data.map(d => d.value),
            borderColor: 'rgb(255, 0, 0)',
            backgroundColor: 'rgba(255, 0, 0, 0.5)'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: "top"
        },
        title: {
          display: true,
          text: "Numero de casos de la zona sanitaria"
        }
      }
    });
    return () => { }
  }, [])

  return (
    <div>
      {/* Aqui aparecera la grafica */}
      <canvas ref={canvas}>
      </canvas>
      <p className="text-danger fw-bold">No consigo sacar la gráfica</p>
    </div>
  );
};

export default GraficaCasos;
