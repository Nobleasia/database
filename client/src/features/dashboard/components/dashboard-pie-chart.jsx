import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export const DashboardPieChart = ({ data }) => {
  return (
    <ResponsiveContainer width="90%" height={220}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={78}
          animationDuration={1000}
          outerRadius={100}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell
              key={`cell-${entry.name}`}
              stroke="transparent"
              className="focus:border-none focus:outline-npa-primary-500 focus:duration-200 hover:brightness-90"
              fill={entry.color}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};
