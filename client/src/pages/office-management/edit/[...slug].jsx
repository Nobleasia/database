import { getEditOfficeLayout } from "@/features/office-management";

const EditOffice = ({ kodePropar }) => {
  return <h1>Edit Office {kodePropar}</h1>;
};

export const getServerSideProps = async ({ query }) => {
  return {
    redirect: {
      destination: `/office-management/edit/${query.slug}/information`,
      permanent: false,
    },
    props: {
      kodePropar: query.slug,
    },
  };
};

EditOffice.getLayout = getEditOfficeLayout;

export default EditOffice;
