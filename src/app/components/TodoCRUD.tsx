"use client"

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Checkbox } from "@/app/components/ui/checkbox"
import { toast } from "@/app/components/ui/use-toast"
import { Pencil, X } from 'lucide-react'

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const API_BASE_URL =`${process.env.NEXT_PUBLIC_BACKEND_URL}`

export default function Component() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const fetchTodos = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/todos/`)
      setTodos(response.data)
    } catch (error) {
      console.error('Error fetching todos:', error)
      toast({
        title: "Error",
        description: "Failed to fetch todos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    setIsLoading(true)
    try {
      await axios.post(`${API_BASE_URL}/todos/`, { title: newTodo, completed: false })
      setNewTodo('')
      fetchTodos()
      toast({
        title: "Success",
        description: "Todo created successfully.",
      })
    } catch (error) {
      console.error('Error creating todo:', error)
      toast({
        title: "Error",
        description: "Failed to create todo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateTodo = async (id: number, data: Partial<Todo>) => {
    setIsLoading(true)
    try {
      await axios.patch(`${API_BASE_URL}/todos/${id}/`, data)
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, ...data } : todo
      ))
      toast({
        title: "Success",
        description: "Todo updated successfully.",
      })
    } catch (error) {
      console.error('Error updating todo:', error)
      toast({
        title: "Error",
        description: "Failed to update todo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTodo = async (id: number) => {
    setIsLoading(true)
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}/`)
      setTodos(todos.filter(todo => todo.id !== id))
      toast({
        title: "Success",
        description: "Todo deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting todo:', error)
      toast({
        title: "Error",
        description: "Failed to delete todo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditingTitle(todo.title)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const saveEdit = async () => {
    if (editingId === null) return
    await updateTodo(editingId, { title: editingTitle })
    setEditingId(null)
    setEditingTitle('')
  }

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={createTodo} className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="New todo"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>Add</Button>
        </form>
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
                <TableCell>
                  {editingId === todo.id ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="w-full"
                      />
                      <Button onClick={saveEdit} disabled={isLoading}>Save</Button>
                      <Button onClick={cancelEditing} variant="outline" disabled={isLoading}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    todo.title
                  )}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={(checked) => updateTodo(todo.id, { completed: checked as boolean })}
                    disabled={isLoading}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {editingId !== todo.id && (
                      <Button 
                        variant="outline" 
                        onClick={() => startEditing(todo)}
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="destructive" 
                      onClick={() => deleteTodo(todo.id)}
                      disabled={isLoading}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}