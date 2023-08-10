const ViewLand = () => {
  return <h1>Land View</h1>;
};

export const getServerSideProps = async ({ query }) => {
  const { slug } = query;

  return {
    redirect: {
      destination: `/land-management/view/${slug}/specification-and-terms`,
      permanent: false,
    },

    props: {},
  };
};

export default ViewLand;
