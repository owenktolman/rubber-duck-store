import {useEffect, useState} from 'react'
import {Box} from '@mui/joy'
import {Navigate, Route, Routes, useLocation} from 'react-router-dom'
import Warehouse from './containers/Warehouse.jsx'
import Store from './containers/Store.jsx'
import Navbar from './components/Navbar.jsx'

//one array to control routing and navbar values
export const navArray = [
    { path: '/warehouse', name: 'Warehouse', element: <Warehouse /> },
    { path: '/store', name: 'Store', element: <Store /> },
]

function App() {
    const location = useLocation()
    const [navIndex, setNavIndex] = useState(0)

    useEffect(() => {
        //handle changing navbar active option if the user navigates to a page via url/link
        const index = navArray.findIndex(i => i.path === location.pathname)
        index && setNavIndex(index)
    }, [location])

    return (
        <Box>
            <Navbar navIndex={navIndex} setNavIndex={setNavIndex} />
            <Routes>
                <Route path='/'>
                    {navArray.map((n, i) => (
                        <Route key={'route'+i} path={n.path} element={n.element} />
                    ))}
                </Route>
                <Route path='*' element={<Navigate to='/warehouse' />} />
            </Routes>
        </Box>
    )
}

export default App
