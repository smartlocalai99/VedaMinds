import { useEffect, useState } from "react";

export default function Reports() {

  const [report, setReport] = useState(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {

    const response = await fetch("/api/dashboard/reports");
    const data = await response.json();

    if (data.success) {
      setReport(data.report);
    }

  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-bold mb-10">
        Reports Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-8">

        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold">
            Total Transactions
          </h2>

          <p className="text-5xl text-green-700 font-bold mt-4">
            {report?.totalTransactions}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold">
            Total Sales
          </h2>

          <p className="text-5xl text-blue-700 font-bold mt-4">
            ₹{report?.totalSales}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold">
            Total Discount
          </h2>

          <p className="text-5xl text-red-600 font-bold mt-4">
            ₹{report?.totalDiscount}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold">
            Total Customers
          </h2>

          <p className="text-5xl text-purple-700 font-bold mt-4">
            {report?.totalCustomers}
          </p>
        </div>

      </div>

    </div>

  );

}