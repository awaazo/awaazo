import react, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Balance } from "../../types/Interfaces";
import PaymentHelper from "../../helpers/PaymentHelper";

const Last5DaysBalance = () => {
  const [balance,setBalance] = useState<Balance[]>(null);
  useEffect(() => {
    const fetchBalance = async () => {
        try{

            const response = await PaymentHelper.GetLast5DaysBalance();

            if(response.status == 200){
                console.log("Succesfully Fetched Balance");
                response.data.forEach((element) =>{
                    element.date = new Date(element.date).getDate() + new Date(element.date).toLocaleString('default', { month: 'long' }).slice(0,3);  ;
                })
                setBalance(response.data.reverse());
            }

            else{
                console.log("Error Occured");
                window.location.href = "/"
            }

        }catch(e){
            console.log("Error occured");
        }

    };
    fetchBalance();
  }, []);


  return (
    
    <ResponsiveContainer width="100%" height="100%">
      <>
        <LineChart
          width={400}
          height={300}
          data={balance}
          margin={{
            top: 20,
            right: 30,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid  /> */}
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
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </>
    </ResponsiveContainer>
  );
};
export default Last5DaysBalance;
