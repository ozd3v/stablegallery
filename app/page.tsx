import HomeStyles from '../styles/Home.module.css'
import CTImage from './components/CTImage'
export default function Home() {


  return (
    <div className={HomeStyles.homeContainer}>
      <h1 className={HomeStyles.title}>Galeria</h1>
      <CTImage />
    </div>
  )
}
