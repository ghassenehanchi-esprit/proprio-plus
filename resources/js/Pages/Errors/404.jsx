import ErrorPage from './ErrorPage';

export default function Error404() {
  return (
    <ErrorPage
      code="404"
      message="La page demandée n'existe pas."
      image="https://www.svgrepo.com/show/506817/real-estate-search.svg"
    />
  );
}
