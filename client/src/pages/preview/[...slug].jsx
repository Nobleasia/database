const ViewPublic = () => {
  return <h1>Public View</h1>;
};

export const getServerSideProps = async ({ query }) => {
  const { slug } = query;

  return {
    redirect: {
      destination: `/preview/${slug}/specification-and-terms`,
      permanent: true,
    },
    props: {},
  };
};

export default ViewPublic;
