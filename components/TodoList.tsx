import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import axios from "axios";
import React, { useCallback, useMemo } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { InitTodo, TodoProp } from "../pages";
import { ToggleButton } from "./ToggleButton";

export type Todos = {
  data?: InitTodo[];
  alterChange?: string;
};

export const TodoList = () => {
  const queryClient = useQueryClient();
  const { data: todos } = useQuery<unknown, Error, TodoProp>("todo", () =>
    queryClient.getQueryData("todo")
  );

  const handleFilter = useMemo(() => {
    const temp = todos;
    if (temp?.alterChange === "Active") {
      return {
        ...temp,
        data: temp?.data?.filter((todo) => todo.isSelected === true),
      };
    } else if (temp?.alterChange === "Complete") {
      return {
        ...temp,
        data: temp?.data?.filter((todo) => todo.isSelected === false),
      };
    }
    return temp;
  }, [todos]);

  //   Handle Toggle Icon
  const handleToggleIcon = useCallback(
    (params: { id: number; isSelected: boolean }) =>
      axios.request({
        method: "patch",
        url: `http://localhost:3004/data/${params.id}`,
        data: { isSelected: !params.isSelected },
      }),
    []
  );

  const mutationToggle = useMutation(
    (params: { id: number; isSelected: boolean }) => handleToggleIcon(params),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("todos");
      },
    }
  );

  // Handle Remove Icon
  const handleRemoveIcon = useCallback(
    (id: number) =>
      axios.request({
        method: "delete",
        url: `http://localhost:3004/data/${id}`,
      }),
    []
  );

  const mutationDelete = useMutation((id: number) => handleRemoveIcon(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  return (
    <section className="w-80 bg-white p-4 rounded-xl mt-4 shadow-lg">
      <h2 className="text-3xl font-semibold text-center pb-2">Todo List</h2>
      <ToggleButton />
      <ul>
        {handleFilter?.data?.map((todo, index) => {
          return (
            <li key={index} className="flex flex-row items-center">
              {todo.isSelected ? (
                <IconButton
                  color="success"
                  onClick={() =>
                    mutationToggle.mutate({
                      id: todo.id,
                      isSelected: todo.isSelected,
                    })
                  }
                >
                  <CheckCircleOutlineIcon />
                </IconButton>
              ) : (
                <IconButton
                  color="inherit"
                  onClick={() =>
                    mutationToggle.mutate({
                      id: todo.id,
                      isSelected: todo.isSelected,
                    })
                  }
                >
                  <RadioButtonUncheckedIcon />
                </IconButton>
              )}
              <p className="flex-1 text-xl">{todo.body}</p>
              <IconButton
                color="error"
                onClick={() => {
                  if (confirm("Bạn có chắc muốn xóa") === true) {
                    mutationDelete.mutate(todo.id);
                  }
                  return
                }}
              >
                <ClearIcon />
              </IconButton>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
