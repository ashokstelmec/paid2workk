import React from 'react'
import Footer from '../components/footer'
import Navbar from '../components/navbar/navbar'
import WorkPageLayout from '../Layouts/workPageLayout'

const WorkPageHOC = () => {
    return (
        <>
            {/* {loggedIn && (
              <Navigations/>
            )} */}
            <WorkPageLayout/>
            <Footer />
        </>
      )
}

export default WorkPageHOC