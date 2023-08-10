const Home = () => {
  return null
}

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/dashboard",
      permanent: false,
    },
    props: {},
  }
}

export default Home
