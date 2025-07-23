import React from 'react'
import Question from '../../components/Question/Question'
import Navbar from '../../components/Navbar/Navbar';
import styles from './LandingPage.module.css';
import ScrollFrame from '../../components/ScrollFrame/ScrollFrame'


export default function LandingPage () {
    return (
        <div className={styles.hero}>
            <div className={styles.navWrapper}>
            <Navbar />
            </div>

            <div className={styles.content}>
                {/* <div className={styles.mainScroll}></div> */}
            {<Question />}
            </div>
            

            
            <div className={styles.backgroundPlaceholder}>
            </div>
        </div>
    )
}

// src/pages/LandingPage/LandingPage.jsx
// import React from 'react'
// import Navbar from '../../components/Navbar/Navbar'
// import ScrollFrame from '../../components/ScrollFrame/ScrollFrame'
// import Question from '../../components/Question/Question'
// import styles from './LandingPage.module.css'

// export default function LandingPage() {
//   return (
//     <div className={styles.hero}>
//       {/* Clip-heavy scroll art header */}
//       <div className={styles.navWrapper}>
//         <Navbar />
//       </div>

//       {/* Main question in its own parchment scroll */}
//       <div className={styles.content}>
//         <ScrollFrame className={styles.mainScroll}>
//           <Question />
//         </ScrollFrame>
//       </div>
//     </div>
//   )
// }
