"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"

// Definimos la interfaz para nuestro objeto Todo
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function Component() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

  // Función para obtener todos los todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/todos')
      setTodos(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  // Función para crear un nuevo todo
  const createTodo = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/todos/', { title: newTodo, completed: false })
      setNewTodo('')
      fetchTodos()
    } catch (error) {
      console.error('Error creating todo:', error)
    }
  }

  // Función para actualizar un todo
  const updateTodo = async (id: number, completed: boolean) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/todos/${id}/`, { completed })
      fetchTodos()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  // Función para eliminar un todo
  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/todos/${id}/`)
      fetchTodos()
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  // Efecto para cargar los todos al montar el componente
  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="New todo"
          />
          <Button onClick={createTodo}>Add</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell>{todo.title}</TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => updateTodo(todo.id, !todo.completed)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => deleteTodo(todo.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}