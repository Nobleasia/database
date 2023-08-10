import { getEditApartmentLayout } from "@/features/apartment-management";

const EditApartment = ({ kodePropar }) => {
  return <h1>Edit Apartment {kodePropar}</h1>;
};

export const getServerSideProps = async ({ query }) => {
  return {
    redirect: {
      destination: `/apartment-management/edit/${query.slug}/information`,
      permanent: false,
    },
    props: {
      kodePropar: query.slug,
    },
  };
};

EditApartment.getLayout = getEditApartmentLayout;

export default EditApartment;
