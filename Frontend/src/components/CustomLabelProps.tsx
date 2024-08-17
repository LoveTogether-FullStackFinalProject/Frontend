import React from 'react';
import { LabelProps } from 'recharts';

interface CustomLabelProps extends LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number | string;
}

const CustomLabel: React.FC<CustomLabelProps> = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  value
}) => {
  const radius = outerRadius + (outerRadius - innerRadius) * 0.32; // Adjust this factor as needed
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text
      x={x}
      y={y}
      fill="#000" // Label color
      textAnchor={x < cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="12px"
      stroke="none"
    >
      {value}
    </text>
  );
};

export default CustomLabel;
