const AddHome = () => {
  return <h1>Add Home</h1>;
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/home-management/add/information",
      permanent: false,
    },
    props: {},
  };
};

export default AddHome;
