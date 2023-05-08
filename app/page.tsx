import HomeStyles from '../styles/Home.module.css'
import CTImage from './components/CTImage'
import Navigation from './components/Navigation'
export default function Home() {


  return (
    <>
      <Navigation />
      <div className={HomeStyles.homeContainer}>
        <h1 className={HomeStyles.title}>Galeria</h1>
        {
          //<CTImage />
        }
        <div>HOLA</div>
      </div>
    </>
  )
}
