import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await api.get("/requests");

    setRequests(res.data);
  };

  return (
    <div>
      <h1>Customer Requests</h1>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>

              <td>
                {request.customerName}
              </td>

              <td>{request.status}</td>

              <td>
                <Link
                  to={`/requests/${request.id}`}
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Requests;