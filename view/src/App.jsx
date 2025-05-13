import React from "react"
import { useEffect } from "react"
import { useAuthStore } from "./stores/authStore"
import {Loader} from 'lucide-react'
import Navbar from "./components/Navbar"
import { Toaster } from "react-hot-toast"
import { Routes,Route, Navigate } from "react-router-dom"
// importinf pages 
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import UserProfile from "./pages/UserProfile"
import DashboardPage from "./pages/DashboardPage"
import CreateTeamPage from "./pages/CreateTeamPage"
import TeamsPage from "./pages/TeamsPage"
import ViewTeam from "./pages/ViewTeam"
import TemplatePage from "./pages/TemplatePage"
import CreateTemplate from "./pages/CreateTemplatePage"
import EditTemplatePage from "./pages/EditTemplatePage"
import UserReportsPage from "./pages/UserReportsPage"
import TeamReportsPage from "./pages/TeamReportsPage"


const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  const isAdmin = authUser?.role?.toLowerCase() === 'admin';

  useEffect(
    ()=>{
      checkAuth()
    }, [checkAuth]
  );
  // if user being verified show loadin
  if(isCheckingAuth && !authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  };

  return (
    <div>
      <Navbar/>
        {/* roouting */}
        <Routes>  
            <Route path="/" element={ authUser ? ( isAdmin ? <UserReportsPage/> : <TeamsPage /> ) : <LoginPage /> } />
            <Route path="/login" element ={ !authUser ? <LoginPage/> : <Navigate to="/" /> }/>
            <Route path="/signup" element ={ !authUser ? <SignupPage/> : <Navigate to="/" /> }/>
            <Route path="/profile" element = { authUser? <UserProfile/> : <Navigate to="/login"/>} />
            <Route path="/create-team" element = { authUser? <CreateTeamPage/> : <Navigate to="/login"/>} />
            <Route path="/project-template" element = { authUser? <TemplatePage/> : <Navigate to="/login"/>} />
            <Route path="/create-template" element = { authUser? <CreateTemplate/> : <Navigate to="/login"/>} />
            <Route path="/edit-template/:templateId" element = { authUser? <EditTemplatePage/> : <Navigate to="/login"/>} />
            {/* <Route path="/teams" element = { authUser? <TeamsPage/> : <Navigate to="/login"/>} /> */}
            <Route path="/view-team/:teamId" element = { authUser? <ViewTeam/> : <Navigate to="/login"/>} />

             {/* Admin-only Routes */}
      <Route path="/team-reports" element={isAdmin ? <TeamReportsPage /> : <Navigate to="/" />} />

        </Routes>
      <Toaster position="top-right"/>
    </div>
  )
}

export default App
