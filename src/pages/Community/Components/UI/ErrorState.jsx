const ErrorState = ({ message }) => {
  return (
    <div className="bg-[var(--community-card)] rounded-2xl p-6 text-center text-red-500">
      <p className="font-semibold">Something went wrong</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  );
};

export default ErrorState;
