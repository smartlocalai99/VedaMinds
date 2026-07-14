import { useEffect, useState } from "react";

export default function Transactions() {

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {

    loadTransactions();

  }, []);

  const loadTransactions = async () => {

    try {

      const response = await fetch("/api/dashboard/transactions");

      const data = await response.json();

      if (data.success) {
        setTransactions(data.transactions);
      }

    } catch (error) {
      console.log(error);
    }

  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        Purchase Transactions
      </h1>

      <div className="overflow-auto bg-white rounded-lg shadow">

        <table className="w-full">

          <thead className="bg-green-700 text-white">

            <tr>

              <th className="p-4 text-left">Customer</th>

              <th className="p-4 text-left">Membership</th>

              <th className="p-4 text-left">Vendor</th>

              <th className="p-4 text-left">Bill</th>

              <th className="p-4 text-left">Discount</th>

              <th className="p-4 text-left">Final Amount</th>

              <th className="p-4 text-left">Payment</th>

              <th className="p-4 text-left">Date</th>

            </tr>

          </thead>

          <tbody>

            {transactions.map((item) => (

              <tr key={item.id} className="border-b">

                <td className="p-4">
                  {item.membership.customerName}
                </td>

                <td className="p-4">
                  {item.membership.membershipNumber}
                </td>

                <td className="p-4">
                  {item.vendor.shopName}
                </td>

                <td className="p-4">
                  ₹{item.billAmount}
                </td>

                <td className="p-4 text-red-600">
                  ₹{item.discountAmount}
                </td>

                <td className="p-4 text-green-700">
                  ₹{item.finalAmount}
                </td>

                <td className="p-4">
                  {item.paymentMode}
                </td>

                <td className="p-4">
                  {new Date(item.transactionDate).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}