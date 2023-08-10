const AddOffice = () => {
  return <h1>Add Office</h1>;
};

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/office-management/add/information",
      permanent: false,
    },
    props: {},
  };
};

export default AddOffice;
