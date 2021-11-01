import React from "react";
import { useParams } from "react-router-dom";
import "./dashboard.css";
import DashboardHeader from "./components/DashboardHeader";

export default function Dashboard() {
  const { id } = useParams<{ id?: string }>();

  console.log(id);

  return (
    <div className="main-container">
      <DashboardHeader />
    </div>
  );
}
