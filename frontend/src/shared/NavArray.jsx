//one array to control routing and navbar values
import Warehouse from '../containers/Warehouse.jsx'
import Store from '../containers/Store.jsx'

export const NavArray = [
    {path: '/', name: 'Warehouse', element: <Warehouse/>},
    {path: '/store', name: 'Store', element: <Store/>},
]
