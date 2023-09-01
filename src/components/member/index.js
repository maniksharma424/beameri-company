import React from "react";
import { Route, Routes } from "react-router-dom";
import CreateMember from "./CreateMember";
import EditMember from "./EditMember";
import ViewMember from "./ViewMember";
import Member from "./Member";

function IndexMember() {
  return (
    <Routes>
      <Route path="/" element={<Member />} />
      <Route path="/createMember" element={<CreateMember />} />
      <Route path="/edit/:id" element={<EditMember />} />
      <Route path="/view/:id" element={<ViewMember />} />
    </Routes>
  );
}

export default IndexMember;
