import { Formik, Form, ErrorMessage } from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";
import axios from 'axios';
import * as yup from "yup";
import { useQueryClient, useMutation } from "react-query";

const TodoForm = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation((data:string) => axios.request({
    method: "post",
    url: "http://localhost:3004/data", 
    data : {
      id: Date.now(),
      body: data,
      isSelected: false,
    }
  }), {
    onSettled: () => {
      queryClient.invalidateQueries('todos') 
    }
  })
  return (
    <section className="w-80 bg-white p-4 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold text-center pb-2">Todo Form</h2>
      <Formik
        initialValues={{ todo: '' }}
        onSubmit={(values : {todo: string}) => {mutation.mutate(values.todo); values.todo = ''}}
        onReset={(values : {todo: string}) => (values.todo = '')}
        validationSchema={yup.object({
          todo: yup.string().required("Please list something to do..."),
        })}
      >
        {(formik : any) => {
          return (
            <Form className="flex flex-col w-full">
              <TextField
                name="todo"
                label="todo"
                variant="filled"
                color={formik.errors.todo ? "error" : "primary"}
                autoComplete="off"
                value={formik.values.todo}
                onChange={formik.handleChange}
              />
              <ErrorMessage
                component={"div"}
                className="text-red-500 text-center py-1"
                name="todo"
              />
              <Button
                variant="contained"
                color="primary"
                classes={{ root: "bg-[#1976d2] my-1" }}
                type="submit"
              >
                SUBMIT
              </Button>
              <Button
                variant="contained"
                color="error"
                classes={{ root: "bg-[red] my-1" }}
                type="reset"
              >
                Reset
              </Button>
            </Form>
          );
        }}
      </Formik>
    </section>
  );
};

export default TodoForm;
