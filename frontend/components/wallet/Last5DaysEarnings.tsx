import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Last5DaysBalance from "./Last5DaysBalace";
import { Balance } from "../../types/Interfaces";
import PaymentHelper from "../../helpers/PaymentHelper";

const GetLast5DaysEarnings = () => {
    const [balance,setBalance] = useState<Balance[]>(null);
  useEffect(() => {
    const fetchData = async () =>{
        try {
            const response = await PaymentHelper.GetLast5DaysEarnings();
            response.data.forEach((element) =>{
                element.date = new Date(element.date).getDate() + new Date(element.date).toLocaleString('default', { month: 'long' }).slice(0,3);  ;
            })
            setBalance(response.data.reverse());
    
        } catch (e) {
          console.log("Error Occured");
        }
    }
    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <>
        <BarChart
          width={400}
          height={300}
          data={balance}
          margin={{
            top: 20,
            right: 30,

            bottom: 5,
          }}
        >
          <XAxis
            dataKey="date"
            label={{ fill: "#EAF0F4" }}
            axisLine={{ stroke: "#EAF0F4" }}
            tickLine={{ stroke: "#EAF0F4" }}
          />
          <YAxis
            fontWeight="bold"
            axisLine={{ stroke: "#EAF0F4" }}
            tickLine={{ stroke: "#EAF0F4" }}
          />

          <Bar dataKey="amount" stackId="a" fill="#8884d8" />
          {/* <Bar dataKey="uv" stackId="a" fill="#82ca9d" /> */}
        </BarChart>
      </>
    </ResponsiveContainer>
  );
};
export default GetLast5DaysEarnings;
