import React from "react";
import { ToggleButton as ToggleBtn, ToggleButtonGroup } from "@mui/material";
import { useQueryClient, useQuery, UseQueryOptions } from "react-query";
import { TodoProp } from "../pages";
import { useCallback } from "react";

export const ToggleButton = () => {
  const queryClient = useQueryClient();
  const {data:todos} = useQuery<unknown, Error, TodoProp>("todo", ()=> queryClient.getQueryData('todo'));

  const handleChange = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (e.currentTarget.innerText === "ALL") {
      return queryClient.setQueryData("todo", (old: TodoProp) => {
        return { ...old, alterChange: "All" };
      });
    } else if (e.currentTarget.innerText === "ACTIVE") {
      return queryClient.setQueryData("todo", (old: TodoProp) => {
        return { ...old, alterChange: "Active" };
      });
    } else if (e.currentTarget.innerText === "COMPLETE") {
      return queryClient.setQueryData("todo", (old: TodoProp) => {
        return { ...old, alterChange: "Complete" };
      });
    }
  }, [queryClient])

  return (
    <ToggleButtonGroup
      className="justify-center w-full"
      color="success"
      value={todos?.alterChange}
      exclusive
      onChange={(e) => handleChange(e)}
    >
      <ToggleBtn value="All" color="success">
        All
      </ToggleBtn>
      <ToggleBtn value="Active" color="success">
        Active
      </ToggleBtn>
      <ToggleBtn value="Complete" color="success">
        Complete
      </ToggleBtn>
    </ToggleButtonGroup>
  );
};
