import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ChartCard = ({ data, type = "bar" }) => {
  const commonProps = {
    data,
    margin: { top: 10, right: 20, left: 0, bottom: 10 },
  };

  return (
    <div className="h-[340px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        {type === "line" ? (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#0f766e" strokeWidth={3} />
          </LineChart>
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
