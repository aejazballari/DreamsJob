import {
  Area,
  XAxis,
  YAxis,
  AreaChart,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AreaChartcomponent = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Area dataKey="count" stroke="#2cb1bc" type="monotone" fill="#bef8fd" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default AreaChartcomponent;
