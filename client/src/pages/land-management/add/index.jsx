const AddLand = () => {
  return <h1>Add Land</h1>;
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/land-management/add/information",
      permanent: false,
    },
    props: {},
  };
};

export default AddLand;
