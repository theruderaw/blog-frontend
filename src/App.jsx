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

function App() {

	return (
		<AuthProvider>
			<BrowserRouter>
				<PointBackground/>
				<Navbar />
				<Routes>
					<Route path='/' element={<Mainpage />} />
                    <Route path='/library' element={<Library/>}/>
					<Route path='/login' element={<Login />} />
                    <Route path="/article" element={<ArticlePage />} />
                    <Route path="/message" element={<Message/>}/>
					<Route element={<ProtectedRoute />}>
						<Route path='/home' element={<Home/>}/>
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/settings' element={<Settings />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App