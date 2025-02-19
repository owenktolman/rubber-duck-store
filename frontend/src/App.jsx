import {useEffect, useState} from 'react'
import {Box} from '@mui/joy'
import {Navigate, Route, Routes, useLocation} from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import {NavArray} from './shared/NavArray.jsx'

function App() {
    const location = useLocation()
    const [navIndex, setNavIndex] = useState(0)

    useEffect(() => {
        //handle changing navbar active option if the user navigates to a page via url/link
        const index = NavArray.findIndex(i => i.path === location.pathname)
        index && setNavIndex(index)
    }, [location])

    return (
        <Box>
            <Navbar navIndex={navIndex} setNavIndex={setNavIndex} />
            <Routes>
                <Route path='/'>
                    {NavArray.map((n, i) => (
                        <Route key={'route'+i} path={n.path} element={n.element} />
                    ))}
                    <Route path='*' element={<Navigate to='/' />} />
                </Route>
            </Routes>
        </Box>
    )
}

export default App
