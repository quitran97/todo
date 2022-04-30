import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import TodoForm from "../components/TodoForm";
import { TodoList } from "../components/TodoList";
import { useQueryClient, useQuery, QueryClient } from "react-query";
import axios from 'axios'

export type InitTodo = {id: number, body: string, isSelected: boolean}
export type TodoProp = {
  data?: InitTodo[],
  alterChange: string
}

// export const initTodo: InitTodo[] = [];

const Home: NextPage = () => {
  const queryClient = useQueryClient()
  // const { data } = useQuery("todos", () => initTodo);
  const { data } = useQuery<Promise<InitTodo[]>,Error,InitTodo[]>("todos", ()=> axios({
    method: 'get',
    url: 'http://localhost:3004/data',
  }).then ((res) => res.data)
  )
  
  queryClient.setQueryData("todo", {data, alterChange: "All"});
  return (
    <React.Fragment>
      <Head>
        <title>Todo Form</title>
      </Head>
      <div className="flex flex-col justify-center items-center bg-slate-500 w-full h-screen">
        <TodoForm />
        <TodoList />
      </div>
    </React.Fragment>
  );
};

export default Home;
