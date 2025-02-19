import {Tab, TabList, Tabs} from '@mui/joy'
import {Link} from 'react-router-dom'
import {NavArray} from '../shared/NavArray.jsx'

const Navbar = ({ navIndex, setNavIndex }) => {
    return (
        <Tabs
            size='lg'
            aria-label='Navigation Bar'
            value={navIndex}
            defaultValue={0}
            onChange={(event, value) => setNavIndex(value)}
        >
            <TabList>
                {NavArray.map((n, i) => (
                    <Link key={'nav'+i} to={n.path} style={{ textDecoration: 'none', color: '#000' }}>
                        <Tab>{n.name}</Tab>
                    </Link>
                ))}
            </TabList>
        </Tabs>
    )
}

export default Navbar
