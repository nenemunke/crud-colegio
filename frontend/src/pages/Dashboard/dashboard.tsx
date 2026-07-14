import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Eliminamos el import de ./Dashboard.scss hasta que exista

const data = [
  { curso: "8vo Básico", riesgo: 12 },
  { curso: "1ro Medio", riesgo: 8 },
  { curso: "4to Medio", riesgo: 3 },
];

export const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <h1>Análisis de Riesgo Académico</h1>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="curso" stroke="#fdfbf7" />
            <YAxis stroke="#fdfbf7" />
            <Tooltip contentStyle={{ backgroundColor: "#2d242e" }} />
            <Bar dataKey="riesgo" fill="#d9a05b">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  style={{
                    filter: "drop-shadow(0px 10px 5px rgba(0,0,0,0.3))",
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <button className="nav-arrow">➡️</button>
    </div>
  );
};
