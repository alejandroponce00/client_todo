import Component from '@/app/components/TodoCRUD'
import TodoCRUD from '@/app/components/TodoCRUD'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-4xl font-bold text-center mb-8">Todo App</h1>
      <Component />
      <footer className='text-center mt-20'>Creado por AlejandroPonce</footer>
    </div>
  )
}