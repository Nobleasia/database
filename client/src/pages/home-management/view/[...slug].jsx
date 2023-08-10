const ViewHome = () => {
  return <h1>Home View</h1>;
};

export const getServerSideProps = async ({ query }) => {
  const { slug } = query;

  return {
    redirect: {
      destination: `/home-management/view/${slug}/specification-and-terms`,
      permanent: false,
    },

    props: {},
  };
};

export default ViewHome;
