
//import '../../styles/globals.css'
import Navigation from '../components/Navigation'
function NavLayout({ children }: any) {
    return (
        <>
            <Navigation />
            {children}
        </>
    )
}

export default NavLayout
