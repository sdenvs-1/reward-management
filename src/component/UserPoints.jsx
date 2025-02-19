import React, { useState, useEffect } from "react";
import AddSession from "./AddSession";

const calculatePoints = (amount) => {
  let points = 0;
  if (amount > 100) {
    points += (amount - 100) * 2;
    amount = 100;
  }
  if (amount >= 50) {
    points += (amount - 50);
  }
  return points;
};

const UserPoints = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
  
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
  
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
  
    fetchData();
  }, []);
  

  const getMonthName = (dateString) => {
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date(dateString);
    return monthNames[date.getMonth()];
  };

  const handleSessionAdded = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
  
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
  
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  

  const renderUserPoints = (user) => {
    let totalPoints = 0;
    const monthlyPoints = {};

    user.sessions.forEach((session) => {
      const month = getMonthName(session.date);
      const points = calculatePoints(session.amount);
      totalPoints += points;

      if (!monthlyPoints[month]) {
        monthlyPoints[month] = 0;
      }
      monthlyPoints[month] += points;
    });

    return (
      <div key={user.id} className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <h6>Total Points: {totalPoints}</h6>
            <h6>Monthly Breakdown:</h6>
            <ul className="list-group">
              {Object.entries(monthlyPoints).map(([month, points]) => (
                <li key={month} className="list-group-item">
                  {month}: {points} points
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h3>Add New Session</h3>
              <AddSession users={users} onSessionAdded={handleSessionAdded} />
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <h2>User Reward Summary</h2>
          <div className="row">
            {loading ? (
              <p>Loading...</p>
            ) : (
              users.map(renderUserPoints)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPoints;
