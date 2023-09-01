import React from "react";
import { Route, Routes } from "react-router-dom";
import Exercise from "./Exercise";
import ViewExercise from "./ViewExercise";

function IndexExercise() {
  return (
    <Routes>
      <Route path="/" element={<Exercise />} />
      <Route path="/view/:id" element={<ViewExercise />} />
    </Routes>
  );
}

export default IndexExercise;
