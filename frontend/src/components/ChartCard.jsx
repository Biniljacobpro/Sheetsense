import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PIE_COLORS = ["#0f766e", "#0891b2", "#14b8a6", "#06b6d4", "#0284c7", "#22d3ee"];

const ChartCard = ({ data, type = "bar" }) => {
  const commonProps = {
    data,
    margin: { top: 10, right: 20, left: 0, bottom: 10 },
  };

  return (
    <div className="h-[420px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:h-[460px]">
      <ResponsiveContainer width="100%" height="100%">
        {type === "line" ? (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} />
          </LineChart>
        ) : type === "pie" ? (
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Tooltip />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{
                maxHeight: "340px",
                overflowY: "auto",
                paddingLeft: "10px",
              }}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="33%"
              cy="50%"
              outerRadius={105}
              innerRadius={42}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.label}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartCard;
