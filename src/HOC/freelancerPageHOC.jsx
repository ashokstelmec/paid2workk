import React from 'react'
import Footer from '../components/footer'
import FreelancerPageLayout from '../Layouts/freelancerPageLayout'

const FreelancerPageHOC = () => {
    return (
        <>
            {/* {loggedIn && (
              <Navigations/>
            )} */}
            <FreelancerPageLayout/>
            <Footer />
        </>
      )
}

export default FreelancerPageHOC