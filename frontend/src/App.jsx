import React from 'react'
import Home from './pages/Home'
import EditCharacter from './pages/EditCharacter'
import CreateCharacter from './pages/CreateCharacter'
import DeleteCharacter from './pages/DeleteCharacter'
import ShowCharacter from './pages/ShowCharacter'
import { Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='characters/create' element={<CreateCharacter />} />
      <Route path='characters/details/:id' element={<ShowCharacter />} />
      <Route path='characters/:id/edit' element={<EditCharacter />} />
      <Route path='characters/delete/:id' element={<DeleteCharacter />} />
    </Routes>
  )
}

export default App