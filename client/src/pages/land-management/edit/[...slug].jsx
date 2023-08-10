import { getEditLandLayout } from "@/features/land-management";

const EditLand = ({ kodePropar }) => {
  return <h1>Edit Land {kodePropar}</h1>;
};

export const getServerSideProps = async ({ query }) => {
  return {
    redirect: {
      destination: `/land-management/edit/${query.slug}/information`,
      permanent: false,
    },
    props: {
      kodePropar: query.slug,
    },
  };
};

EditLand.getLayout = getEditLandLayout;

export default EditLand;
