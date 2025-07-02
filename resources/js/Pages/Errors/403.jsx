import ErrorPage from './ErrorPage';

export default function Error403() {
  return (
    <ErrorPage
      code="403"
      message="Vous n'avez pas accès à cette page."
      image="https://www.svgrepo.com/show/402299/real-estate-lock.svg"
    />
  );
}
