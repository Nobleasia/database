const AddApartment = () => {
  return <h1>Add Apartment</h1>;
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/apartment-management/add/information",
      permanent: false,
    },
    props: {},
  };
};

export default AddApartment;
