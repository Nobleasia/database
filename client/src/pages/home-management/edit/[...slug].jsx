import { getEditHomeLayout } from "@/features/home-management";

const EditHome = ({ kodePropar }) => {
  return <h1>Edit Home {kodePropar}</h1>;
};

export const getServerSideProps = async ({ query }) => {
  return {
    redirect: {
      destination: `/home-management/edit/${query.slug}/information`,
      permanent: false,
    },
    props: {
      kodePropar: query.slug,
    },
  };
};

EditHome.getLayout = getEditHomeLayout;

export default EditHome;
