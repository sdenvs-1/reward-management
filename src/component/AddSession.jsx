import React, { useState } from "react";

const AddSession = ({ users, onSessionAdded }) => {
  const [selectedUser, setSelectedUser] = useState(users.length > 0 ? users[0].id : "");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleAddSession = async (event) => {
    event.preventDefault();

    if (!amount || !date || !selectedUser) {
      alert("Please fill in all fields.");
      return;
    }

    const newSession = {
      date,
      amount: parseInt(amount, 10),
    };

    try {
      const response = await fetch(`http://localhost:5000/users/${selectedUser}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const user = await response.json();

      user.sessions.push(newSession);

      const putResponse = await fetch(`http://localhost:5000/users/${selectedUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!putResponse.ok) {
        throw new Error("Failed to update user data");
      }

      onSessionAdded();
    } catch (error) {
      console.error("Error adding session", error);
      alert("Failed to add session.");
    }
  };

  return (
    <form onSubmit={handleAddSession}>
      <div className="mb-3">
        <label htmlFor="userSelect" className="form-label">Select User</label>
        <select
          id="userSelect"
          className="form-control"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="sessionDate" className="form-label">Date</label>
        <input
          type="date"
          id="sessionDate"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="sessionMinutes" className="form-label">Amount</label>
        <input
          type="number"
          id="sessionMinutes"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">Add Session</button>
    </form>
  );
};

export default AddSession;
