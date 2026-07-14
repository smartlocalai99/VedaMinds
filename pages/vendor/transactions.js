import { useEffect, useState } from "react";

export default function VendorTransactions() {

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {

    const token = localStorage.getItem("token");

    const res = await fetch("/api/vendors/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      setTransactions(data.transactions);
    } else {
      alert(data.message);
    }
  }

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        Transaction History
      </h1>

      <table className="w-full bg-white shadow rounded-lg">

        <thead className="bg-green-700 text-white">

          <tr>

            <th className="p-4">Customer</th>

            <th>Membership</th>

            <th>Bill</th>

            <th>Discount</th>

            <th>Final</th>

            <th>Payment</th>

            <th>Date</th>

          </tr>

        </thead>

        <tbody>

          {transactions.map((item) => (

            <tr
              key={item.id}
              className="border-b text-center"
            >

              <td className="p-4">
                {item.membership.customerName}
              </td>

              <td>
                {item.membership.membershipNumber}
              </td>

              <td>
                ₹{item.billAmount}
              </td>

              <td>
                ₹{item.discountAmount}
              </td>

              <td>
                ₹{item.finalAmount}
              </td>

              <td>
                {item.paymentMode}
              </td>

              <td>
                {new Date(item.transactionDate).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}