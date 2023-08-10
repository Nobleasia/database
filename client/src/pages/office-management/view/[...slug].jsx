const ViewOffice = () => {
  return <h1>Office View</h1>;
};

export const getServerSideProps = async ({ query }) => {
  const { slug } = query;

  return {
    redirect: {
      destination: `/office-management/view/${slug}/specification-and-terms`,
      permanent: false,
    },

    props: {},
  };
};

export default ViewOffice;
