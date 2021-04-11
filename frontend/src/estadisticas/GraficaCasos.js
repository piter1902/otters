import useD3 from "./useD3";
import * as d3 from "d3";

// <div className="card mt-4">
//     <div className="card-body">
//         <p className="display-1">
//             Gráfica aquí
//         </p>
//     </div>
// </div>

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

  // Referencia de la gráfica d3
  const ref = useD3(
    (svg) => {
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };

      const height = 500;

      const width = 500;

      const x = d3
        .scaleUtc()
        .domain(d3.extent(data, (d) => Date.parse(d.date)))
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const line = d3
        .line()
        .defined((d) => !isNaN(d.value))
        .x((d) => x(d.date))
        .y((d) => y(d.value));

      const xAxis = (g) =>
        g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .ticks(width / 80)
            .tickSizeOuter(0)
        );

      const yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          .call((g) => g.select(".domain").remove())
          .call((g) =>
            g
              .select(".tick:last-of-type text")
              .clone()
              .attr("x", 3)
              .attr("text-anchor", "start")
              .attr("font-weight", "bold")
              .text(data.y)
          );

      // Definición
      svg
        .attr("viewBox", [0, 0, width, height])
        .attr("fill", "none")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");

      svg.append("g").call(xAxis);

      svg.append("g").call(yAxis);

      svg
        .append("path")
        .datum(data.filter(line.defined()))
        .attr("stroke", "#ccc")
        .attr("d", line);

      svg
        .append("path")
        .datum(data)
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    },
    [data.length]
  );

  return (
    <div>
      <svg
        ref={ref}
        style={{
          height: 500,
          width: "100%",
          marginRight: "0px",
          marginLeft: "0px",
          backgroundColor: "white",
        }}
        className="card mt-md-4 mt-5 mb-md-3 mb-2"
        id="svgGrafica"
      >
        <g className="plot-area" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <p className="text-danger fw-bold">No consigo sacar la gráfica</p>
    </div>
  );
};

export default GraficaCasos;
