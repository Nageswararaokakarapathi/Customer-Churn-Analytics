export interface DaxMeasure {
  name: string;
  formula: string;
  explanation: string;
}

export const DAX_MEASURES: DaxMeasure[] = [
  {
    name: "Total Customers",
    formula: "Total Customers = DISTINCTCOUNT ( Customers[CustomerID] )",
    explanation:
      "Counts every unique customer in the current filter context. Base measure for all ratios.",
  },
  {
    name: "Churn Customers",
    formula:
      "Churn Customers = CALCULATE ( [Total Customers], Customers[Churn] = \"Yes\" )",
    explanation:
      "Number of customers flagged as churned. Drives churn rate and revenue-lost analysis.",
  },
  {
    name: "Active Customers",
    formula:
      "Active Customers = CALCULATE ( [Total Customers], Customers[Churn] = \"No\" )",
    explanation: "Customers still retained. Equal to Total − Churn.",
  },
  {
    name: "Churn Rate",
    formula:
      "Churn Rate % = DIVIDE ( [Churn Customers], [Total Customers], 0 )",
    explanation:
      "Share of customers who left. DIVIDE guards against divide-by-zero. Format as %.",
  },
  {
    name: "Retention Rate",
    formula:
      "Retention Rate % = DIVIDE ( [Active Customers], [Total Customers], 0 )",
    explanation: "Complement of churn rate; the headline retention KPI.",
  },
  {
    name: "Total Revenue",
    formula: "Total Revenue = SUM ( Customers[TotalCharges] )",
    explanation:
      "Lifetime revenue booked across all customers in context.",
  },
  {
    name: "Revenue Lost",
    formula:
      "Revenue Lost = CALCULATE ( [Total Revenue], Customers[Churn] = \"Yes\" )",
    explanation:
      "Revenue tied to churned customers — the financial cost of attrition.",
  },
  {
    name: "Average Monthly Charges",
    formula: "Avg Monthly Charges = AVERAGE ( Customers[MonthlyCharges] )",
    explanation: "Mean recurring monthly bill; indicator of pricing tier.",
  },
  {
    name: "Average Tenure",
    formula: "Avg Tenure = AVERAGE ( Customers[Tenure] )",
    explanation: "Mean months of relationship; higher tenure = stickier base.",
  },
  {
    name: "Customer Lifetime Value",
    formula:
      "Customer Lifetime Value = [Avg Monthly Charges] * [Avg Tenure]",
    explanation:
      "Simplified CLV = expected monthly spend × expected lifetime in months.",
  },
  {
    name: "Average Revenue",
    formula:
      "Avg Revenue per Customer = DIVIDE ( [Total Revenue], [Total Customers], 0 )",
    explanation: "Revenue concentration per customer (ARPU-style).",
  },
  {
    name: "High Risk Customers",
    formula:
      "High Risk Customers =\nCALCULATE (\n    [Total Customers],\n    Customers[Contract] = \"Month-to-month\",\n    Customers[Tenure] < 12\n)",
    explanation:
      "Customers matching top churn drivers (short tenure + flexible contract). Priority for retention outreach.",
  },
  {
    name: "Premium Customers",
    formula:
      "Premium Customers =\nCALCULATE (\n    [Total Customers],\n    Customers[MonthlyCharges] >= 85,\n    Customers[Tenure] >= 24\n)",
    explanation:
      "High-spend, long-tenure customers — the most valuable and worth protecting.",
  },
];
