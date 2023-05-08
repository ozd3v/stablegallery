'use client'
import Link from 'next/link'
import styles from '../../styles/Navigation.module.css'
import { useContext, useEffect, useState } from 'react'
//import { AccountContext } from '../auth/Account'
import { useRouter } from 'next/navigation'
//import { useSelector } from 'react-redux'
import { routes } from '../config'
import lang from '../config/lang'
import logo from '../../public/octanobg.png'
import Image from 'next/image'
//import CerrandoSesion from './CerrandoSesion'
// https://stackoverflow.com/questions/74421327/nextrouter-was-not-mounted-next-js
const link = routes

export default function Navigation() {
  //const { logout } = useContext(AccountContext)
  const router = useRouter()
  //const session = useSelector(state => state.session.value)
  const [noshow, setNoshow] = useState(false)

  const logoutCtx = async () => {
    //await logout()
    //router.push(config.absoluteURLPath + '/bye')
    // await navigate(config.absoluteURLPath + "/bye");
  }
  /*
  useEffect(() => {
    if (!session) {
      setNoshow(true)
    }
  }, [session])
  */
  return (
    <> {
      noshow
        ? ('')
        : (
          <nav className={`navbar navbar-expand-lg navbar-light ${styles.navigation} ${styles.navCustomBackGround}`}>
            <div className='container-fluid'>
              <a className='navbar-brand' href='#'>
                <Image src={logo.src} alt='' width='40' height='35' className='d-inline-block align-text-top' placeholder='empty'

                />
                Stabble Gallery
              </a>
              <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarScroll' aria-controls='navbarScroll' aria-expanded='false' aria-label='Toggle navigation'>
                <span className='navbar-toggler-icon' />
              </button>
              <div className='collapse navbar-collapse' id='navbarScroll'

              >
                <ul className={`navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll`}

                >
                  {link.map(({ route, label, nested, children }: any) => {
                    return (
                      <li key={route} className={nested ? `nav-item dropdown` : `nav-item`}
                        style={{ 'border': 'red' }}
                      >
                        <Link
                          className={nested ? 'nav-link dropdown-toggle' : 'nav-link'}
                          href={nested ? '#' : route}
                          id={'navbarScrollingDropdown' + route}
                          role={nested ? 'button' : undefined}
                          data-bs-toggle={nested ? 'dropdown' : null}
                          aria-expanded={nested ? 'false' : undefined}
                          aria-current={nested ? 'page' : undefined}
                        >{label}
                        </Link>
                        {nested
                          ? (
                            <ul className='dropdown-menu' aria-labelledby={'navbarScrollingDropdown' + route} style={{ margin: 0 }}>
                              {
                                children.map(({ route, label }: any) => (
                                  <li key={route} className='nav-item' >
                                    <Link className='dropdown-item nav-item' href={route}>
                                      {label}
                                    </Link>
                                  </li>
                                ))
                              }
                            </ul>
                          )
                          : null}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </nav >
        )
    }

    </>
  )
}