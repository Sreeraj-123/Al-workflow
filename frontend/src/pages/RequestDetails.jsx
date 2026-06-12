import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "../services/api";

function RequestDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  const [note, setNote] = useState("");

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    const res = await api.get(
      `/requests/${id}`
    );

    setData(res.data);
  };

  const addNote = async () => {
    await api.post(
      `/requests/${id}/notes`,
      {
        note,
      }
    );

    fetchDetails();
  };

  const updateStatus = async (
    status
  ) => {
    await api.patch(
      `/requests/${id}/status`,
      {
        status,
      }
    );

    fetchDetails();
  };

  if (!data) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>
        Request #{data.request.id}
      </h1>

      <p>
        Customer:
        {data.request.customerName}
      </p>

      <p>
        Message:
        {data.request.message}
      </p>

      <p>
        Status:
        {data.request.status}
      </p>

      <button
        onClick={() =>
          updateStatus("resolved")
        }
      >
        Resolve
      </button>

      <hr />

      <h2>Add Note</h2>

      <input
        value={note}
        onChange={(e) =>
          setNote(e.target.value)
        }
      />

      <button onClick={addNote}>
        Add
      </button>

      <hr />

      <h2>Notes</h2>

      {data.notes.map((note) => (
        <div key={note.id}>
          {note.note}
        </div>
      ))}
    </div>
  );
}

export default RequestDetails;