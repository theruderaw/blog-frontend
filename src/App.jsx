import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import { AuthProvider } from './components/Auth/AuthContext'
import Mainpage from './components/Screens/Mainpage'
import Login from './components/Screens/Login'
import Dashboard from './components/Screens/Dashboard'
import Settings from './components/Screens/Settings'
import Navbar from './components/Common/Navbar'
import PointBackground from './components/Common/PointBackground'
import Home from './components/Screens/Home'
import Library from './components/Screens/Library'
import ArticlePage from './components/Screens/ArticlePage'
import Message from './components/Screens/Message'
import EditArticle from './components/Screens/EditArticle'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                {/* 1. Root container pins layout to exact viewport dimensions and stops window scrolling */}
                <div className="flex flex-col h-screen w-screen overflow-hidden bg-black relative">
                    
                    {/* Background canvas stays safely structural behind the text */}
                    <PointBackground/>

                    {/* 2. Navbar spans full width and auto-sizes horizontally */}
                    <Navbar />

                    {/* 3. This wrapper captures 100% of the remaining height below the Navbar */}
                    <main className="flex-1 w-full min-h-0 relative z-10">
                        <Routes>
                            <Route path='/' element={<Mainpage />} />
                            <Route path='/library' element={<Library/>}/>
                            <Route path='/login' element={<Login />} />
                            <Route path="/article" element={<ArticlePage disabled={true}/>} />
                            <Route path="/message" element={<Message/>}/>
                            <Route element={<ProtectedRoute />}>
                                <Route path='/home' element={<Home/>}/>
                                <Route path='/dashboard' element={<Dashboard />} />
                                <Route path="/edit" element={<EditArticle/>} />
                                <Route path='/settings' element={<Settings />} />
                            </Route>
                        </Routes>
                    </main>

                </div>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App