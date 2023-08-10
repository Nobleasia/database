const ViewApartment = () => {
  return <h1>Apartment View</h1>;
};

export const getServerSideProps = async ({ query }) => {
  const { slug } = query;

  return {
    redirect: {
      destination: `/apartment-management/view/${slug}/specification-and-terms`,
      permanent: false,
    },

    props: {},
  };
};

export default ViewApartment;
